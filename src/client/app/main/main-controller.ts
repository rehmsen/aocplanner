/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/js-yaml/js-yaml.d.ts" />

// interface IMainControllerScope extends ng.IScope {
//   buildOrder: 
// }

interface IAge {
   name: string;
   index: number;
}

interface ICost {
  wood: number;
  food: number;
  stone: number;
  gold: number;
}

interface ICivilization {
  name: string
}

interface IBuildable {
  id: string;
  age: number;
  buildDuration: number;
  cost: ICost;
}

interface IBuilding extends IBuildable {
  room: number;
}

interface ITechnology extends IBuildable {
  building: string
}

interface IUnit extends IBuildable {
  building: string;
}

enum BuildableType {
  unit,
  building,
  technology
}

interface IBuildOrderItem {
  type: BuildableType;
  offset: number;
  start: number;
  subject: IBuildable;
}

interface ISettings {
  resources: string;
  allTechs: boolean;
}

interface IQueue {
  buildingId: string;
  start: number;
  length: number;
  items: IBuildOrderItem[];
}


class MainController {
  loaded = false;
  ages: IAge[] = [];
  age: IAge;
  buildings: IBuilding[];
  civilizations: ICivilization[];
  technologies: ITechnology[];
  units: IUnit[];
  startResources: {low: ICost};
  buildOrder: IBuildOrderItem[];
  hasBuilding;
  settings: ISettings;
  queues: IQueue[];
  timeScale: number;
  t: number;

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
          this.buildings = rules.buildings;
          this.technologies = rules.technologies;
          this.units = rules.units;
          this.startResources = rules.startResources;
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
    this.settings = {
      resources: 'low',
      allTechs: true
    };
    this.queues = [
      {
        buildingId: 'town_center',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },      
    ];
    this.settings.allTechs = true;
    this.timeScale = 3;
    this.t = 0;
  }

  interpolateState(time: number) {
    if (!this.loaded) {
      return;
    }
    time = time !== undefined ? time : Number.MAX_VALUE;
    var state = {
      resources: angular.copy(this.startResources[this.settings.resources]),
      pop: 4, 
      popCap: 5
    };
    this.buildOrder.forEach(function(item) {
      if (item.start > time) {
        return;
      }

      if (item.type === BuildableType.building) {
        var building = <IBuilding>item.subject;
        state.popCap += building.room;
      }
      if (item.type === BuildableType.unit) {
        state.pop++;
      }
      angular.forEach(item.subject.cost, function(quantity, resource) {
        state.resources[resource] -= quantity;
      });
    });
    return state;
  }

  build(building): void {
    building.building = 'villager';
    var queue = this.enqueue_({
      type: 'building',
      subject: building
    });
    var completionTime = queue.length;
    this.queues.push({
      buildingId: building.id,
      start: completionTime, 
      length: 0,
      items: []
    });
    this.hasBuilding[building.id] = true;
  }

  research(tech): void {
    tech.researched = true;
    this.enqueue_({
      type: 'tech',
      subject: tech
    });
  }

  train(unit): void {
    this.enqueue_({
      type: 'unit',
      subject: unit
    });
  }

  private enqueue_(item) {
    var queue = this.queues.filter(function(queue) { 
      return queue.buildingId === item.subject.building;
    })[0];
    item.offset = 0;
    item.start = queue.length + item.offset;
    queue.items.push(item);
    queue.length += item.offset + item.subject.buildDuration;

    // TODO(oler): Replace with binary search.
    var index = 0;
    this.buildOrder.forEach(function(eachItem) {
      if (eachItem.start > item.start) {
        return;
      }
      index++;
    });
    this.buildOrder.splice(index, 0, item);
    this.t = queue.start + queue.length;
    return queue;
  }
}


export = MainController
