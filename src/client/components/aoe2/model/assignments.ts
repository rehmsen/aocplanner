import core = require('./core');
import build = require('./build');

export class ReassignmentItem implements core.IBuildOrderItem {
  isSpendingResources = false;

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
          {count: this.count, task: this.toTask, assignable: fromAssignment.assignable};
    }
  }  
}