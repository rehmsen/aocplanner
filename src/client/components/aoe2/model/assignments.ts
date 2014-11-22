import core = require('./core');
import build = require('./build');

export class TaskAssignment implements core.IAssignment {
  constructor(
      public count: number,
      public task: core.ITask,
      public assignable: core.IAssignable) {
  }

  apply(delta: number, state: core.IState): void {
    this.task.updateState(state, delta, this.count);
  }
}

export class ReassignmentItem implements core.IBuildOrderItem {
  constructor(
      public start: number,
      private count: number,
      private fromTask: core.ITask,
      private toTask: core.ITask) {}

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
          new TaskAssignment(this.count, this.toTask, fromAssignment.assignable);
    }
  }  
}