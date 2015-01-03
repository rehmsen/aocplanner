import core = require('./core');

export class Building extends core.Buildable {
  static create(object: any):Building {
    return new Building(
        object.id, object.age, object.buildDuration, object.cost, 
        object.room || 0, !object.noQueue);
  }

  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      public room: number,
      hasQueue: boolean) {
    super(id, age, buildDuration, cost, null, hasQueue);
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
  initial: boolean = false;

  constructor(public building: Building) {
    this.object = building.id;
    this.id = core.TaskVerb[this.verb] + ':' + this.object; 
  }

  get cssClass(): string { return 'icon-' + this.building.id; }

  computeDuration(count: number): number {
    return this.building.buildDuration / Math.sqrt(count);
  }

  isAvailable(assignable: core.IAssignable, state: core.IState): boolean {
    return assignable.tasks[core.TaskVerb[this.verb]] && this.building.age <= state.age.index;
  }

  onAssign(state: core.IState): void {
    state.buildNext(this.building);
  }
}

export interface IEffect {
  started: string;
  finished: string;
}

export class Technology extends core.Buildable {
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
    if (progress < 1.0 && this.effect_ && this.effect_.started) {
      eval(this.effect_.started);
    }
  }

  finished(state: core.IState) {
    super.finished(state);
    if (this.effect_ && this.effect_.finished){
      eval(this.effect_.finished);
    }
    state.hasTechnology[this.id] = true;
  }
}

export class Unit extends core.Buildable implements core.IAssignable {
  constructor(
      id: string,
      age: number,
      buildDuration: number,
      cost: core.IResources,
      source: string,
      public tasks: {[verb: string]: {[source: string]: number}}) {
    super(id, age, buildDuration, cost, source);
  }

  static create(object: any): Unit {
    return new Unit(
        object.id, object.age, object.buildDuration, object.cost, 
        object.source, object.tasks)    
  }

  canBuild(state: core.IState): boolean {
    return super.canBuild(state) && state.pop + 1 <= state.popCap;
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
  type = 'BuildableStarted';
  isSpendingResources = true;
  initialTask: core.ITask;

  constructor(
      public start: number,
      public buildable: core.Buildable) {
  }

  get end(): number {
    return this.start + this.buildable.buildDuration;
  }

  apply(state: core.IState) {
    var delta = state.time - this.start;
    this.buildable.started(state, delta);
  }
}

export class BuildableFinishedItem implements core.IBuildOrderItem {
  type = 'BuildableFinished';
  isSpendingResources = false;

  constructor(
      public start: number,
      public buildable: core.Buildable) {
  }

  apply(state: core.IState) {
    this.buildable.finished(state);
  }
}

export class Queue {
  private duration: number =  0;
  private items: BuildableStartedItem[] = [];

  constructor(
      public source: string,
      public start: number = 0) {
  }

  push(item: BuildableStartedItem) {
    this.items.push(item);
    this.duration = item.end - this.start;
  }

  get end(): number {
    return this.start + this.duration;
  }

  get empty(): boolean {
    return this.items.length == 0;
  }

  get last(): BuildableStartedItem {
    return this.items[this.items.length-1];
  }
}