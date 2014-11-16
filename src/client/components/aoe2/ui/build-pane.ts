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
      currentState: '='
    },
    link: function postLink(
      scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
    },
    controller: BuildPaneDirectiveController,
    controllerAs: 'ctrl'
  };
}

class BuildPaneDirectiveController {
  currentState: State;
  hasStartedTechnology: {[technologyId: string]: boolean} = {};
  worker: build.Unit;
  assignmentFactory: assignments.AssignmentFactory;

  constructor(
      $scope,
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.currentState = $scope.currentState;
    this.rulesService.loadingPromise.then(function() {
      this.assignmentFactory = new assignments.AssignmentFactory(
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
      this.worker = unit;
    } else {
      var queue = this.buildOrderService.enqueueBuildableItem(unit);
      this.currentState.time = queue.start + queue.length;
    }
  }

  assign(task: string): void {
    var queue = this.buildOrderService.enqueueBuildableItem(this.worker);
    var buildableItem = <build.BuildableItem>queue.items[queue.items.length-1];
    buildableItem.initialTask = task;
    var reassignementItem = new assignments.ReassignmentItem(
      queue.length,
      1,
      null,
      task,
      this.assignmentFactory);
    this.buildOrderService.sortInItem(reassignementItem);
    this.currentState.time = queue.start + queue.length;
    this.worker = null;
  }

}

export = createBuildPaneDirective;
