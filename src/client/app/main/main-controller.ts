/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/js-yaml/js-yaml.d.ts" />

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

interface IState {
  resources: ICost;
  pop: number;
  popCap: number;
}

class Buildable {
  constructor(
      public id: string,
      public age: number,
      public buildDuration: number,
      public cost: ICost,
      public source: string) {
  }

  build(state: IState) {
    angular.forEach(this.cost, function(quantity, resource) {
      state.resources[resource] -= quantity;
    });    
  }
}

class Building extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: ICost,
      source: string,
      public room: number) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any):Building {
    return new Building(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.room)
  }

  build(state: IState) {
    super.build(state);
    state.popCap += this.room;
  }
}

class Technology extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: ICost,
      source: string) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Technology {
    return new Technology(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source)    
  }

}

class Unit extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: ICost,
      source: string) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Unit {
    return new Unit(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source)    
  }

  build(state: IState) {
    state.pop++;
  }
}

interface IBuildOrderItem {
  offset: number;
  start: number;

  apply(state: IState);
}

class BuildableItem implements IBuildOrderItem {
  offset: number;
  start: number;

  constructor(public buildable: Buildable) {
  }

  apply(state: IState) {
    this.buildable.build(state);
  }
}

interface ISettings {
  resources: string;
  allTechs: boolean;
}

interface IQueue {
  source: string;
  start: number;
  length: number;
  items: IBuildOrderItem[];
}


class MainController {
  ages: IAge[] = [];
  civilizations: ICivilization[];
  startResources: {low: ICost};

  loaded = false;
  timeScale: number;

  age: IAge;
  buildings: Building[];
  technologies: Technology[];
  units: Unit[];
  buildOrder: IBuildOrderItem[];
  hasBuilding;
  hasTechnology;
  settings: ISettings;
  queues: IQueue[];
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
          this.buildings = rules.buildings.map(Building.create);
          this.technologies = rules.technologies.map(Technology.create);
          this.units = rules.units.map(Unit.create);
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
      item.apply(state);
    });
    return state;
  }

  build(building: Building): void {
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

  research(tech: Technology): void {
    this.hasTechnology[tech.id] = true;
    this.enqueueBuildableItem_(tech);
  }

  train(unit: Unit): void {
    this.enqueueBuildableItem_(unit);
  }

  private enqueueBuildableItem_(buildable: Buildable): IQueue {
    var item = new BuildableItem(buildable);
    var queue = this.queues.filter(function(queue) { 
      return queue.source === item.buildable.source;
    })[0];
    item.offset = 0;
    item.start = queue.length + item.offset;
    queue.items.push(item);
    queue.length += item.offset + buildable.buildDuration;

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
