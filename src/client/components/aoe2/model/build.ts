import core = require('./core');

export class Buildable {
  constructor(
      public id: string,
      public age: number,
      public buildDuration: number,
      public cost: core.IResources,
      public source: string) {
  }

  started(state: core.IState, delta: number) {
    angular.forEach(this.cost, function(quantity, resource) {
      state.resources[resource] -= quantity;
    });    
  }

  progress(state: core.IState, delta: number) {

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
      public room: number) {
    super(id, age, buildDuration, cost, 'villager');
  }

  static create(object: any):Building {
    return new Building(
        object.id, object.age, object.buildDuration, object.cost, 
        object.room || 0);
  }

  finished(state: core.IState) {
    super.finished(state);
    state.hasBuilding[this.id] = true;
    state.popCap += this.room;
  }
}

export class ConstructionTask implements core.ITask {
  verb = core.TaskVerb.construct;  
  object: string;
  id: string;

  constructor(public building: Building) {
    this.object = building.id;
    this.id = core.TaskVerb[this.verb] + ':' + this.object; 
  }

  updateState(state: core.IState, delta: number, count: number): void {}

  enqueue() : void{}
}

export interface IEffect {
  started: string;
  finished: string;
}

export class Technology extends Buildable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      source: string,
      private effect_: IEffect) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Technology {
    return new Technology(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.effect);

  }

  started(state: core.IState, delta: number) {
    super.started(state, delta);
    var progress = delta / this.buildDuration;
    if (progress < 1.0) {
      eval(this.effect_.started);
    }
  }

  finished(state: core.IState) {
    super.finished(state);
    eval(this.effect_.finished);
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

  started(state: core.IState, delta: number) {
    super.started(state, delta);
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
  public initialTask: core.ITask;

  constructor(
      public offset: number,
      public start: number,
      public buildable: Buildable) {
  }

  apply(state: core.IState) {
    var delta = state.time - this.start;
    this.buildable.started(state, delta);
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

  add(unit: Unit, task: core.ITask): boolean {
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

  set(unit: Unit, task: core.ITask, toBeTrained: boolean = false) {
    if (task.verb != core.TaskVerb.idle && toBeTrained) {
      throw new Error('Newly trained workers must initially be idle');
    }
    this.reset();
    this.add(unit, task);
    this.toBeTrained = toBeTrained;
  }
}

export class Queue {
  length: number =  0;
  private items: BuildableStartedItem[] = [];

  constructor(
      public source: string,
      public start: number = 0) {
  }

  push(item: BuildableStartedItem) {
    this.items.push(item);
    var offset = item.start - this.length
    var itemEnd = item.start + item.buildable.buildDuration;
    this.length = Math.max(this.length, itemEnd);
  }

  get end(): number {
    return this.start + this.length;
  }

  get empty(): boolean {
    return this.items.length == 0;
  }

  get last(): BuildableStartedItem {
    return this.items[this.items.length-1];
  }
}