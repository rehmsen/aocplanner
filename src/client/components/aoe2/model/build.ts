import core = require('core');

export class Buildable {
  constructor(
      public id: string,
      public age: number,
      public buildDuration: number,
      public cost: core.Resources,
      public source: string) {
  }

  build(state: core.IState) {
    angular.forEach(this.cost, function(quantity, resource) {
      state.resources[resource] -= quantity;
    });    
  }
}

export class Building extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.Resources,
      source: string,
      public room: number) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any):Building {
    return new Building(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.room || 0);
  }

  build(state: core.IState) {
    super.build(state);
    state.popCap += this.room;
    // TODO(olrehm): This should not happen until the building is done.
    state.hasBuilding[this.id] = true;
  }
}

export class Technology extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.Resources,
      source: string) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Technology {
    return new Technology(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source)    
  }

  build(state: core.IState) {
    super.build(state);
    // TODO(olrehm): This should not happen until the technology is done.
    state.hasTechnology[this.id] = true;
  }
}

export class Unit extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.Resources,
      source: string,
      public tasks: string[]) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Unit {
    return new Unit(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.tasks)    
  }

  build(state: core.IState) {
    super.build(state);
    state.pop++;
  }
}

export class BuildableItem implements core.IBuildOrderItem {
  public initialTask: string;

  constructor(
      public offset: number,
      public start: number,
      public buildable: Buildable) {
  }

  apply(state: core.IState) {
    this.buildable.build(state);
  }
}
