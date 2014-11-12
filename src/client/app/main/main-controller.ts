/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/js-yaml/js-yaml.d.ts" />
import build = require('../../components/model/build');
import core = require('../../components/model/core');
import assignments = require('../../components/model/assignments');

class MainController {
  ages: core.IAge[] = [];
  civilizations: core.ICivilization[];
  startResources: {low: core.Resources};

  loaded = false;
  timeScale: number;

  age: core.IAge;
  buildings: build.Building[];
  technologies: build.Technology[];
  units: build.Unit[];
  resourceSources: core.IResourceSource[];
  tasks: string[];
  buildOrder: core.IBuildOrderItem[];
  hasBuilding;
  hasTechnology;
  settings: core.ISettings;
  queues: core.IQueue[];
  t: number;
  worker: build.Unit;
  assignmentFactory: assignments.AssignmentFactory;

  constructor($scope, $http: ng.IHttpService) {
    $http.get('assets/rules/aoc.yaml').
        success(function(data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
          var rules = jsyaml.safeLoad(data);
          this.civilizations = rules.civilizations;
          rules.ages.forEach(function(age, index) {
            age.index = index;
            this.ages.push(age);
          }.bind(this));
          this.age = this.ages[0];
          this.buildings = rules.buildings.map(build.Building.create);
          this.technologies = rules.technologies.map(build.Technology.create);
          this.units = rules.units.map(build.Unit.create);
          this.resourceSources = rules.resourceSources;
          this.assignmentFactory = new assignments.AssignmentFactory(this.resourceSources);
          this.tasks = ['idle', 'build'];
          this.resourceSources.forEach(function(resourceSource) {
            this.tasks.push(resourceSource.id);
          }, this);

          this.startResources = {};
          angular.forEach(rules.startResources, function(resources, key) {
            this.startResources[key] = core.Resources.create(resources);
          }, this);
          this.loaded = true;
        }.bind(this)).
        error(function(data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
          console.log(data);
        });
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
    this.t = 0;
  }

  interpolateState(time: number) {
    if (!this.loaded) {
      return;
    }
    time = time !== undefined ? time : Number.MAX_VALUE;
    var state = new core.State(
      angular.copy(this.startResources[this.settings.resources]),
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
    this.t = queue.start + queue.length;
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
