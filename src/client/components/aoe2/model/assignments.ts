import core = require('./core');
import build = require('./build');

export class IdleAssignment implements core.IAssignment {
  task = new core.IdleTask();
  constructor(
      public count: number) {}

  apply(delta: number, state: core.IState): void {}
}

export class GatheringAssignment implements core.IAssignment {
  task: core.HarvestTask;
  
  constructor(
      public count: number,
      public source: core.IResourceSource) {
    this.task = new core.HarvestTask(source);
  }

  apply(delta: number, state: core.IState): void {
     state.resources[this.source.resource] += 
         this.count * this.source.rate * delta;
  }
}

export class ConstructionAssignment implements core.IAssignment {

    constructor(
        public count: number,
        public task: build.ConstructionTask) {
    }

  apply(delta: number, state: core.IState): void {
  }
}

export class AssignmentFactory {
  sources: {[id: string]: core.IResourceSource} = {};
  constructor(sources: core.IResourceSource[]) {
    sources.forEach(function(source){
      this.sources[source.id] = source;
    }, this);
  }

  create(task: core.ITask, count: number): core.IAssignment {
    if (task.verb == core.TaskVerb.idle) {
      return new IdleAssignment(count);
    } else if (task.verb == core.TaskVerb.harvest) {
      return new GatheringAssignment(count, this.sources[task.object]);
    } else if (task.verb == core.TaskVerb.construct) {
      return new ConstructionAssignment(count, <build.ConstructionTask>task);
    } else {
      throw new Error('Unknown task: ' + task);
    }
  }
}

export class ReassignmentItem implements core.IBuildOrderItem {
  constructor(
      public start: number,
      private count: number,
      private fromTask: core.ITask,
      private toTask: core.ITask,
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