import core = require('./core');

export class Buildable {
  constructor(
      public id: string,
      public age: number,
      public buildDuration: number,
      public cost: core.IResources,
      public source: string) {
  }

  started(state: core.IState) {
    angular.forEach(this.cost, function(quantity, resource) {
      state.resources[resource] -= quantity;
    });    
  }

  finished(state: core.IState) {

  }
}

export class Building extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      source: string,
      public room: number) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any):Building {
    return new Building(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.room || 0);
  }

  finished(state: core.IState) {
    super.finished(state);
    state.hasBuilding[this.id] = true;
    state.popCap += this.room;
  }
}

export class Technology extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      source: string) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Technology {
    return new Technology(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source)    
  }

  finished(state: core.IState) {
    super.finished(state);
    state.hasTechnology[this.id] = true;
  }
}

export class Unit extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      source: string,
      public tasks: {[verb: string]: string[]}) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Unit {
    return new Unit(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.tasks)    
  }

  started(state: core.IState) {
    super.started(state);
    state.pop++;
  }

  finished(state: core.IState) {
    super.finished(state);
    if (this.tasks) {
      state.assignments['idle'].count++;
    }    
  }
}

export class BuildableStartedItem implements core.IBuildOrderItem {
  public initialTask: core.Task;

  constructor(
      public offset: number,
      public start: number,
      public buildable: Buildable) {
  }

  apply(state: core.IState) {
    this.buildable.started(state);
  }
}

export class BuildableFinishedItem implements core.IBuildOrderItem {
  constructor(
      public offset: number,
      public start: number,
      public buildable: Buildable) {
  }

  apply(state: core.IState) {
    this.buildable.finished(state);
  }
}

export class Selection {
  unit: Unit;
  taskCounts: {[taskId: string]: core.ITaskCount};
  toBeTrained: boolean; 

  constructor() {
    this.reset();
  }

  reset() {
    this.unit = null;
    this.taskCounts = {};
    this.toBeTrained = false;
  }

  add(unit: Unit, task: core.Task): boolean {
    if (this.unit && this.unit.id != unit.id || this.toBeTrained) {
      return false;
    }
    this.unit = unit;
    if (!this.taskCounts[task.id]) {
      this.taskCounts[task.id] = {task: task, count: 1};
    } else {
      this.taskCounts[task.id].count++;
    }
    return true;
  }

  set(unit: Unit, task: core.Task, toBeTrained: boolean = false) {
    if (task.verb != core.TaskVerb.idle && toBeTrained) {
      throw new Error('Newly trained workers must initially be idle');
    }
    this.reset();
    this.add(unit, task);
    this.toBeTrained = toBeTrained;
  }
}
