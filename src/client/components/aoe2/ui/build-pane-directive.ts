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
      this.selection.set(unit, new core.IdleTask());
    }
  }

  assign(toTask: core.ITask): void {
    if (this.trainedItem_) {
      this.trainedItem_.initialTask = toTask;
      this.trainedItem_ = null;
    }

    var totalCount = 0;
    angular.forEach(this.selection.taskCounts, (fromTaskCount) => {
      var reassignementItem = new assignments.ReassignmentItem(
        this.currentState.time,
        fromTaskCount.count,
        fromTaskCount.task,
        toTask);
      totalCount += fromTaskCount.count;
      this.assignmentSequence_.push(reassignementItem);
      this.buildOrderService.sortInItem(reassignementItem);
    });
    this.selection.taskCounts = {};

    toTask.onAssign(this.currentState);
    this.currentState.update(this.currentState.time);

    this.taskVerb = null;
    if (toTask.fixedTime) {
      this.selection.taskCounts[toTask.id] = {
        assignable: this.selection.assignable, 
        count: totalCount,
        task: toTask
      };
    } else {
      this.buildOrderService.assignmentSequences.push(
          this.assignmentSequence_);
      this.assignmentSequence_ = [];
      this.selection.reset();
    }
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
