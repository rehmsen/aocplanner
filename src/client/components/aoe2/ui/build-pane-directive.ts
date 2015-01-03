/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import BuildOrderService = require('../model/build-order-service');
import RulesService = require('../model/rules-service');
import State = require('../model/state');
import assignments = require('../model/assignments');
import build = require('../model/build');
import core = require('../model/core');

function createBuildPaneDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/build-pane.html',
    restrict: 'E',
    scope: {
      currentState: '=',
      selection: '=',
      error: '='
    },
    controller: BuildPaneDirectiveController,
    controllerAs: 'ctrl',
    bindToController: true
  };
}

class BuildPaneDirectiveController {
  currentState: State;
  hasStartedTechnology: {[technologyId: string]: boolean} = {};
  selection: core.Selection;
  taskVerb: string;
  error: string;
  private trainedItem_: build.BuildableStartedItem;
  private assignmentSequence_: assignments.ReassignmentItem[] = [];

  constructor(
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.selection.registerOnReset(this.onResetSelection.bind(this));
  }

  get tasks(): core.ITask[] {
    if (!this.taskVerb || !this.rulesService.loaded) {
      return [];
    }

    return this.rulesService.tasks[this.taskVerb].filter((task: core.ITask) => {
      return task.isAvailable(this.selection.assignable, this.currentState);
    });
  }

  research(tech: build.Technology): void {
    this.buildCatchingError_(tech);
    this.hasStartedTechnology[tech.id] = true;
  }

  train(unit: build.Unit): void {
    if (this.currentState.pop >= this.currentState.popCap) {
      this.error = 'Not enough room - build more houses!';
      return;
    }

    var item = this.buildCatchingError_(unit);

    if (unit.tasks) {
      this.selection.set(unit, new core.IdleTask(true));
    }
    // Has to happen afterwards because otherwise the selection setting will clear it.
    this.trainedItem_ = item;
  }

  assign(toTask: core.ITask): void {
    try {
      var previousReassignment = this.assignmentSequence_[this.assignmentSequence_.length-1];
      var previousEndTime = previousReassignment ? previousReassignment.end : this.currentState.time;
      this.currentState.update(previousEndTime);
      toTask.onAssign(this.currentState);
      var fromTask = this.selection.taskCount.task;
      if (previousReassignment && this.currentState.time > previousEndTime) {
        fromTask = new core.IdleTask();
        this.enqueueReassignment(new assignments.ReassignmentItem(
            previousEndTime, previousReassignment.count, 
            previousReassignment.toTask, fromTask,
            this.currentState.time - previousEndTime));
      }

      if (this.trainedItem_ && toTask.computeDuration(1) == Infinity) {
        this.trainedItem_.initialTask = toTask;
      }
      this.trainedItem_ = null;
      var reassignmentItem = new assignments.ReassignmentItem(
        this.currentState.time, this.selection.taskCount.count,
        fromTask, toTask);
      this.enqueueReassignment(reassignmentItem);

      if (this.assignmentSequence_.length == 1) {
        this.buildOrderService.assignmentSequences.push(
            this.assignmentSequence_);
      }

      this.taskVerb = null;
      if (reassignmentItem.end < Infinity) {
        this.selection.taskCount.task = toTask;
        this.currentState.update(reassignmentItem.end);
      } else {
        this.currentState.update(this.assignmentSequence_[0].start);
        this.selection.reset();
      }
    } catch(e) {
      this.error = e.message;
    }
  }

  onResetSelection = function() {
    var l = this.assignmentSequence_.length;
    if (l > 0 && this.assignmentSequence_[l-1].end < Infinity) {
      var last = this.assignmentSequence_[l-1];
      this.enqueueReassignment(new assignments.ReassignmentItem(
          last.end, last.count, last.toTask, new core.IdleTask()));
    }

    this.assignmentSequence_ = [];
    this.trainedItem_ = null;  
    this.taskVerb = null;
  }

  enqueueReassignment(reassignmentItem: assignments.ReassignmentItem) {
    this.assignmentSequence_.push(reassignmentItem);
    this.buildOrderService.sortInItem(reassignmentItem);
  }

  private buildCatchingError_(buildable: core.Buildable): 
      build.BuildableStartedItem {
    try {
      var item = this.currentState.buildNext(buildable);
      this.currentState.update(item.end);  
      return item;
    } catch(e) {
      this.error = e.message;
    }
  }
}

export = createBuildPaneDirective;
