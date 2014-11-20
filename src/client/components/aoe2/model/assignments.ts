import core = require('./core');

export class IdleAssignment implements core.IAssignment {
  task = core.Task.createIdle();
  constructor(
      public count: number) {}

  apply(delta: number, state: core.IState): void {}
}

export class GatheringAssignment implements core.IAssignment {
  task: core.Task;
  
  constructor(
      public count: number,
      public source: core.IResourceSource) {
    this.task = core.Task.createHarvest(source.id);
  }

  apply(delta: number, state: core.IState): void {
     state.resources[this.source.resource] += 
         this.count * this.source.rate * delta;
  }
}

export class AssignmentFactory {
  sources: {[id: string]: core.IResourceSource} = {};
  constructor(sources: core.IResourceSource[]) {
    sources.forEach(function(source){
      this.sources[source.id] = source;
    }, this);
  }

  create(task: core.Task, count: number): core.IAssignment {
    if (task.verb == core.TaskVerb.idle) return new IdleAssignment(count);
    else if (task.verb == core.TaskVerb.harvest) return new GatheringAssignment(count, this.sources[task.object]);
    else throw new Error('Unknown task: ' + task);
  }
}

export class ReassignmentItem implements core.IBuildOrderItem {
  constructor(
      public start: number,
      private count: number,
      private fromTask: core.Task,
      private toTask: core.Task,
      private assignmentFactory: AssignmentFactory) {}

  apply(state: core.IState) {
    if (this.fromTask) {
      var fromAssignment = state.assignments[this.fromTask.id];
      if (!fromAssignment || fromAssignment.count < this.count) {
        throw new Error(
            'Cannot reassign ' + this.count + ' workers from assignment ' + 
            fromAssignment);
      }      
      fromAssignment.count -= this.count;
    }
    var toAssignment = state.assignments[this.toTask.id];
    if (toAssignment) {
      toAssignment.count += this.count;
    } else {
      toAssignment = state.assignments[this.toTask.id] = 
          this.assignmentFactory.create(this.toTask, this.count); 
    }
  }  
}