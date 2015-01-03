export enum Resource {
  lumber,
  food,
  stone,
  gold
}

export interface IResources {
  lumber: number;
  food: number;
  stone: number;
  gold: number;
  [resource: string]: number;
}

export interface IResourceSource {
  id: string;
  resource: Resource;
  rate: number;
}

export interface IAssignable {
  id: string;
  tasks: {[verb: string]: {[source: string]: number}};
}

export class Selection {
  assignable: IAssignable;
  taskCount: ITaskCount;
  private resetCallbacks_: { (): void }[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.resetCallbacks_.forEach((callback) => callback());
    this.assignable = null;
    this.taskCount = null;
  }

  isCompatible(assignable: IAssignable, task: ITask): boolean {
    if (this.assignable && this.assignable.id != assignable.id) {
      // TODO(rehmsen): Should throw error
      return false;
    }
    if (this.taskCount && this.taskCount.task.id != task.id) {
      // TODO(rehmsen): Should throw error
      return false;
    }
    return true;    
  }

  add(assignable: IAssignable, task: ITask): boolean {
    if (!this.isCompatible(assignable, task)) return false;
    this.assignable = assignable;
    if (!this.taskCount) {
      this.taskCount = {task: task, count: 1, assignable: assignable};
    } else {
      this.taskCount.count++;
    }
    return true;
  }

  set(assignable: IAssignable, task: ITask) {
    this.reset();
    this.add(assignable, task);
  }

  registerOnReset(callback: () => void) {
    this.resetCallbacks_.push(callback);
  }
}

export interface IState {
  time: number;
  resources: IResources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: ITaskCount};
  age: IAge;
  ageProgress: number;
  hasBuilding: {[buildingId: string]: boolean};
  hasTechnology: {[technologyId: string]: boolean};

  buildNext(buildable: Buildable, initialTask?: ITask): void;
}


export enum TaskVerb {
  idle,
  harvest,
  construct
}

export interface ITask {
  verb: TaskVerb;
  object?: string;
  id: string;
  cssClass: string;
  initial: boolean;

  computeDuration(count: number): number;
  isAvailable(assignable: IAssignable, state: IState): boolean;
  onAssign(state: IState): void;
}

export class IdleTask implements ITask {
  verb = TaskVerb.idle;
  id = TaskVerb[this.verb];

  constructor(public initial: boolean = false) {
  }

  get cssClass(): string { return 'icon-' + this.id; }

  computeDuration(count: number): number {
    return Infinity;
  }

  isAvailable(assignable: IAssignable, state: IState): boolean {
    return false;
  }

  onAssign(state: IState): void {}
}

export class HarvestTask implements ITask {
  verb = TaskVerb.harvest;  
  object: string;
  id: string;
  initial: boolean = false;

  get cssClass(): string { return 'icon-' + this.object; }

  constructor(public source: IResourceSource) {
    this.object = source.id;
    this.id = TaskVerb[this.verb] + ':' + this.object; 
  }

  computeDuration(count: number): number {
    return Infinity;
  }

  isAvailable(assignable: IAssignable, state: IState): boolean {
    var sourceRates = assignable.tasks[TaskVerb[this.verb]];
    return sourceRates && sourceRates[this.object] !== undefined;
  }

  onAssign(state: IState): void {}
}

export interface ITaskCount {
  assignable: IAssignable;
  count: number;
  task: ITask;  
}

export interface IBuildOrderItem {
  type: string;
  start: number;
  isSpendingResources: boolean;

  apply(state: IState, time: number): void;
}

export interface IAge {
   name: string;
   index: number;
}

export interface ICivilization {
  name: string
}

export interface ISettings {
  resources: string;
  allTechs: boolean;
}

export class Buildable {
  constructor(
      public id: string,
      public age: number,
      public buildDuration: number,
      public cost: IResources,
      public source: string,
      public hasQueue = false) {
  }

  canBuild(state: IState): boolean {
    var result = true;
    angular.forEach(this.cost, (quantity, resource) => {
      result = result && state.resources[resource] >= quantity;
    });
    return result;
  }

  started(state: IState, delta: number) {
    angular.forEach(this.cost, (quantity, resource) => {
      state.resources[resource] -= quantity;
    });    
  }

  progress(state: IState, delta: number) {

  }

  finished(state: IState) {

  }
}
