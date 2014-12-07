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
      var unitTasksObjects = this.selection.assignable.tasks[this.taskVerb];
      return unitTasksObjects !== undefined && 
          (task.verb != core.TaskVerb.harvest || unitTasksObjects.indexOf(task.object) > -1);
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

    this.trainedItem_ = this.buildCatchingError_(unit);

    if (unit.tasks) {
      this.selection.set(unit, new core.IdleTask(true));
    }
  }

  assign(toTask: core.ITask): void {
    if (this.trainedItem_ && toTask.computeDuration(1) == Infinity) {
      this.trainedItem_.initialTask = toTask;
    }
    this.trainedItem_ = null;

    var reassignmentItem = new assignments.ReassignmentItem(
      this.currentState.time,
      this.selection.taskCount.count,
      this.selection.taskCount.task,
      toTask);
    this.assignmentSequence_.push(reassignmentItem);
    this.buildOrderService.sortInItem(reassignmentItem);

    if (this.assignmentSequence_.length == 1) {
      this.buildOrderService.assignmentSequences.push(
          this.assignmentSequence_);
    }

    try {
      toTask.onAssign(this.currentState);
    } catch(e) {
      this.error = e.message;
    }
    this.currentState.update(this.currentState.time);

    this.taskVerb = null;
    if (toTask.computeDuration(this.selection.taskCount.count) < Infinity) {
      this.selection.taskCount.task = toTask;
    } else {
      this.selection.reset();
    }
  }

  onResetSelection = function() {
    var l = this.assignmentSequence_.length;
    if (l > 0 && this.assignmentSequence_[l-1].end < Infinity) {
      var last = this.assignmentSequence_[l-1];
      var reassignmentToIdle = new assignments.ReassignmentItem(
        last.end,
        last.count,
        last.toTask,
        new core.IdleTask());
      this.assignmentSequence_.push(reassignmentToIdle);
      this.buildOrderService.sortInItem(reassignmentToIdle);
    }

    this.assignmentSequence_ = [];
    this.trainedItem_ = null;  
    this.taskVerb = null;
  }

  private buildCatchingError_(buildable: core.Buildable): 
      build.BuildableStartedItem {
    try {
      return this.currentState.buildNext(buildable);
    } catch(e) {
      this.error = e.message;
    }
  }
}

export = createBuildPaneDirective;
