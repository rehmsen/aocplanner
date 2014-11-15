/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import build = require('../../components/aoe2/model/build');
import core = require('../../components/aoe2/model/core');
import assignments = require('../../components/aoe2/model/assignments');
import BuildOrderService = require('../../components/aoe2/model/build-order-service');
import RulesService = require('../../components/aoe2/model/rules-service');
import State = require('../../components/aoe2/model/state');

class MainController {
  timeScale: number = 3;

  age: core.IAge;

  hasBuilding;
  hasTechnology;
  settings: core.ISettings;
  worker: build.Unit;
  assignmentFactory: assignments.AssignmentFactory;
  currentState: State;


  constructor($scope, 
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};
    this.settings = {
      resources: 'low',
      allTechs: true
    };
    this.currentState = new State(
        buildOrderService, rulesService, this.settings);

    this.rulesService.load('assets/rules/aoc.yaml').then(function() {
      this.age = this.rulesService.ages[0];
      this.assignmentFactory = new assignments.AssignmentFactory(
          this.rulesService.resourceSources);
      this.currentState.time = 0;
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
    this.hasBuilding[building.id] = true;
  }

  research(tech: build.Technology): void {
    this.hasTechnology[tech.id] = true;
    var queue = this.buildOrderService.enqueueBuildableItem(tech);
    this.currentState.time = queue.start + queue.length;
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
    this.currentState.time = queue.start + queue.length;
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
