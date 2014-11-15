/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import build = require('../../components/aoe2/model/build');
import core = require('../../components/aoe2/model/core');
import assignments = require('../../components/aoe2/model/assignments');
import RulesService = require('../../components/aoe2/model/rules-service');


class MainController {
  timeScale: number;

  age: core.IAge;

  buildOrder: core.IBuildOrderItem[];
  hasBuilding;
  hasTechnology;
  settings: core.ISettings;
  queues: core.IQueue[];
  worker: build.Unit;
  assignmentFactory: assignments.AssignmentFactory;
  currentState: core.IState;

  private _time: number;


  constructor($scope, public rulesService: RulesService) {
    this.rulesService.load('assets/rules/aoc.yaml').then(function() {
      this.age = this.rulesService.ages[0];
      this.assignmentFactory = new assignments.AssignmentFactory(
          this.rulesService.resourceSources);
      this.time = 0;
    }.bind(this));

    this.buildOrder = [];
    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};
    this.settings = {
      resources: 'low',
      allTechs: true
    };
    this.queues = [
      {
        source: 'town_center',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },      
    ];
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
    this.buildOrder.forEach(function(item) {
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
    var queue = this.enqueueBuildableItem_(building);
    var completionTime = queue.length;
    this.queues.push({
      source: building.id,
      start: completionTime, 
      length: 0,
      items: []
    });
    this.hasBuilding[building.id] = true;
  }

  research(tech: build.Technology): void {
    this.hasTechnology[tech.id] = true;
    this.enqueueBuildableItem_(tech);
  }

  train(unit: build.Unit): void {
    if (unit.tasks) {
      this.worker = unit;
    } else {
      this.enqueueBuildableItem_(unit);
    }
  }

  assign(task: string): void {
    var queue = this.enqueueBuildableItem_(this.worker);
    var buildableItem = <build.BuildableItem>queue.items[queue.items.length-1];
    buildableItem.initialTask = task;
    var reassignementItem = new assignments.ReassignmentItem(
      queue.length,
      1,
      null,
      task,
      this.assignmentFactory);
    this.sortIntoBuildOrder_(reassignementItem);
    this.worker = null;buildableItem
  }

  private enqueueBuildableItem_(buildable: build.Buildable): core.IQueue {
    var queue = this.queues.filter(function(queue) { 
      return queue.source === buildable.source;
    })[0];
    var offset = 0;
    var item = new build.BuildableItem(
        offset, queue.length + offset, buildable);
    queue.items.push(item); 
    queue.length += item.offset + buildable.buildDuration;
    this.sortIntoBuildOrder_(item);
    this.time = queue.start + queue.length;
    return queue;
  }

  private sortIntoBuildOrder_(item: core.IBuildOrderItem) {
    // TODO(oler): Replace with binary search.
    var index = 0;
    this.buildOrder.forEach(function(eachItem) {
      if (eachItem.start > item.start) {
        return;
      }
      index++;
    });
    this.buildOrder.splice(index, 0, item);    
  }
}


export = MainController
