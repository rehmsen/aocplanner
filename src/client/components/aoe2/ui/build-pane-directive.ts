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
      selection: '='
    },
    controller: BuildPaneDirectiveController,
    controllerAs: 'ctrl',
    bindToController: true
  };
}

class BuildPaneDirectiveController {
  currentState: State;
  hasStartedTechnology: {[technologyId: string]: boolean} = {};
  selection: build.Selection;
  taskVerb: string;

  constructor(
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
  }

  get tasks(): core.ITask[] {
    if (!this.taskVerb || !this.rulesService.loaded) {
      return [];
    }

    return this.rulesService.tasks[this.taskVerb].filter(function(task: core.ITask) {
      var unitTasksObjects = this.selection.unit.tasks[this.taskVerb];
      return unitTasksObjects !== undefined && 
          (task.verb != core.TaskVerb.harvest || unitTasksObjects.indexOf(task.object) > -1);
    }.bind(this));
  }

  construct(building: build.Building): void {
    var queueEnd = this.buildOrderService.enqueueBuildable(
        building, this.currentState.time);
    this.currentState.time = queueEnd;
  }

  research(tech: build.Technology): void {
    var queueEnd = this.buildOrderService.enqueueBuildable(
        tech, this.currentState.time);
    this.currentState.time = queueEnd;
    this.hasStartedTechnology[tech.id] = true;
  }

  train(unit: build.Unit): void {
    if (unit.tasks) {
      this.selection.set(unit, new core.IdleTask(), true);
    } else {
      var queueEnd = this.buildOrderService.enqueueBuildable(
        unit, this.currentState.time);
      this.currentState.time = queueEnd;
    }
  }

  assign(toTask: core.ITask): void {
    if (this.selection.toBeTrained) {
      var queueEnd = this.buildOrderService.enqueueBuildable(
        this.selection.unit, this.currentState.time);
    }

    angular.forEach(this.selection.taskCounts, function(fromTaskCount) {
      var reassignementItem = new assignments.ReassignmentItem(
        this.currentState.time,
        fromTaskCount.count,
        fromTaskCount.task,
        toTask);
      this.buildOrderService.sortInItem(reassignementItem);
    }, this);

    var newTime = toTask.updateBuildOrder(
        this.buildOrderService, queueEnd);
    this.currentState.time = newTime;

    this.selection.reset();
    this.taskVerb = null;
  }

}

export = createBuildPaneDirective;
