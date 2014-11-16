/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import BuildOrderService = require('../model/build-order-service');
import RulesService = require('../model/rules-service');
import State = require('../model/state');
import assignments = require('../model/assignments');
import build = require('../model/build');

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
  private assignmentFactory_: assignments.AssignmentFactory;

  constructor(
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.rulesService.loadingPromise.then(function() {
      this.assignmentFactory_ = new assignments.AssignmentFactory(
          this.rulesService.resourceSources);
    }.bind(this));
  }

  build(building: build.Building): void {
    building.source = 'villager';
    var queue = this.buildOrderService.enqueueBuildableItem(building);
    this.currentState.time = queue.start + queue.length;
    var completionTime = queue.length;
    this.buildOrderService.queues.push({
      source: building.id,
      start: completionTime, 
      length: 0,
      items: []
    });
  }

  research(tech: build.Technology): void {
    var queue = this.buildOrderService.enqueueBuildableItem(tech);
    this.currentState.time = queue.start + queue.length;
    this.hasStartedTechnology[tech.id] = true;
  }

  train(unit: build.Unit): void {
    if (unit.tasks) {
      this.selection.set(unit, 'idle', true);
    } else {
      var queue = this.buildOrderService.enqueueBuildableItem(unit);
      this.currentState.time = queue.start + queue.length;
    }
  }

  assign(toTask: string): void {
    if (this.selection.toBeTrained) {
      var queue = this.buildOrderService.enqueueBuildableItem(this.selection.unit);
      var buildableItem = <build.BuildableItem>queue.items[queue.items.length-1];
      buildableItem.initialTask = toTask;
    }

    angular.forEach(this.selection.taskCounts, function(count, fromTask) {
      var reassignementItem = new assignments.ReassignmentItem(
        queue.length,
        count,
        fromTask,
        toTask,
        this.assignmentFactory_);
      this.buildOrderService.sortInItem(reassignementItem);
    }, this);
    this.currentState.time = queue.start + queue.length;
    this.selection.reset();
  }

}

export = createBuildPaneDirective;
