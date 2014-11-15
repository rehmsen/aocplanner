/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import build = require('../../components/aoe2/model/build');
import core = require('../../components/aoe2/model/core');
import assignments = require('../../components/aoe2/model/assignments');
import BuildOrderService = require('../../components/aoe2/model/build-order-service');
import RulesService = require('../../components/aoe2/model/rules-service');


class MainController {
  timeScale: number;

  age: core.IAge;

  hasBuilding;
  hasTechnology;
  settings: core.ISettings;
  worker: build.Unit;
  assignmentFactory: assignments.AssignmentFactory;
  currentState: core.IState;

  private _time: number;


  constructor($scope, 
      public rulesService: RulesService, 
      public buildOrderService: BuildOrderService) {
    this.rulesService.load('assets/rules/aoc.yaml').then(function() {
      this.age = this.rulesService.ages[0];
      this.assignmentFactory = new assignments.AssignmentFactory(
          this.rulesService.resourceSources);
      this.time = 0;
    }.bind(this));

    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};
    this.settings = {
      resources: 'low',
      allTechs: true
    };

    this.timeScale = 3;
  }

  set time(time: number) {
    this._time = time;
    this.currentState = this.interpolateState(time);
  }

  get time(): number {
    return this._time;
  }

  interpolateState(time: number) {
    if (!this.rulesService.loaded) {
      return;
    }
    time = time !== undefined ? time : Number.MAX_VALUE;
    var state = new core.State(
      angular.copy(this.rulesService.startResources[this.settings.resources]),
      4, 5, {'idle': new assignments.IdleAssignment(3)});
    var lastTime = 0;
    this.buildOrderService.buildOrder.forEach(function(item) {
      var delta = Math.min(item.start, time) - lastTime;
      angular.forEach(state.assignments, function(assignment: core.IAssignment) {
        assignment.apply(delta, state);
      }, this);

      lastTime += delta;
      if (item.start > time) {
        return;
      }
      item.apply(state);
    });
    var delta = time - lastTime;
    angular.forEach(state.assignments, function(assignment: core.IAssignment) {
      assignment.apply(delta, state);
    }, this);

    return state;
  }

  build(building: build.Building): void {
    building.source = 'villager';
    var queue = this.buildOrderService.enqueueBuildableItem(building);
    this.time = queue.start + queue.length;
    var completionTime = queue.length;
    this.buildOrderService.queues.push({
      source: building.id,
      start: completionTime, 
      length: 0,
      items: []
    });
    this.hasBuilding[building.id] = true;
  }

  research(tech: build.Technology): void {
    this.hasTechnology[tech.id] = true;
    var queue = this.buildOrderService.enqueueBuildableItem(tech);
    this.time = queue.start + queue.length;
  }

  train(unit: build.Unit): void {
    if (unit.tasks) {
      this.worker = unit;
    } else {
      var queue = this.buildOrderService.enqueueBuildableItem(unit);
      this.time = queue.start + queue.length;
    }
  }

  assign(task: string): void {
    var queue = this.buildOrderService.enqueueBuildableItem(this.worker);
    this.time = queue.start + queue.length;
    var buildableItem = <build.BuildableItem>queue.items[queue.items.length-1];
    buildableItem.initialTask = task;
    var reassignementItem = new assignments.ReassignmentItem(
      queue.length,
      1,
      null,
      task,
      this.assignmentFactory);
    this.buildOrderService.sortInItem(reassignementItem);
    this.worker = null;buildableItem
  }
}


export = MainController
