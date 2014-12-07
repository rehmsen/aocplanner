import core = require('./core');
import build = require('./build');

export class ReassignmentItem implements core.IBuildOrderItem {
  type = 'reassignment';
  isSpendingResources = false;

  constructor(
      public start: number,
      public count: number,
      public fromTask: core.ITask,
      public toTask: core.ITask) {}

  get end(): number {
    return this.start + this.toTask.computeDuration(this.count);
  }

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