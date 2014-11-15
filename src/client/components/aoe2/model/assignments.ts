import core = require('core');

export class IdleAssignment implements core.IAssignment {
  task = 'idle';
  constructor(
      public count: number) {}

  apply(delta: number, state: core.State): void {}
}

export class GatheringAssignment implements core.IAssignment {
  task: string;
  
  constructor(
      public count: number,
      public source: core.IResourceSource) {
    this.task = source.id;
  }

  apply(delta: number, state: core.State): void {
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

  create(task: string, count: number): core.IAssignment {
    if (task == 'idle') return new IdleAssignment(count);
    else if (task in this.sources) return new GatheringAssignment(count, this.sources[task]);
    else throw new Error('Unknown task: ' + task);
  }
}

export class ReassignmentItem implements core.IBuildOrderItem {
  constructor(
      public start: number,
      private count: number,
      private fromTask: string,
      private toTask: string,
      private assignmentFactory: AssignmentFactory) {}

  apply(state: core.IState) {
    if (this.fromTask) {
      var fromAssignment = state.assignments[this.fromTask];
      if (!fromAssignment || fromAssignment.count < this.count) {
        throw new Error(
            'Cannot reassign ' + this.count + ' workers from assignment ' + 
            fromAssignment);
      }      
      fromAssignment.count -= this.count;
    }
    var toAssignment = state.assignments[this.toTask];
    if (toAssignment) {
      toAssignment.count += this.count;
    } else {
      toAssignment = state.assignments[this.toTask] = 
          this.assignmentFactory.create(this.toTask, this.count); 
    }
  }  
}