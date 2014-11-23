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
  tasks: {[verb: string]: string[]};
}

export class Selection {
  assignable: IAssignable;
  taskCounts: {[taskId: string]: ITaskCount};

  constructor() {
    this.reset();
  }

  reset() {
    this.assignable = null;
    this.taskCounts = {};
  }

  add(assignable: IAssignable, task: ITask): boolean {
    if (this.assignable && this.assignable.id != assignable.id) {
      return false;
    }
    this.assignable = assignable;
    if (!this.taskCounts[task.id]) {
      this.taskCounts[task.id] = {task: task, count: 1, assignable: assignable};
    } else {
      this.taskCounts[task.id].count++;
    }
    return true;
  }

  set(assignable: IAssignable, task: ITask) {
    this.reset();
    this.add(assignable, task);
  }
}

export interface IState {
  time: number;
  resources: IResources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: IAssignment};
  age: IAge;
  ageProgress: number;
  hasBuilding: {[buildingId: string]: boolean};
  hasTechnology: {[technologyId: string]: boolean};
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
  icon: string;

  updateState(state: IState, delta: number, count: number): void

  updateBuildOrder(
      buildOrderService: IBuildOrderService, currentTime: number): number
}

export class IdleTask implements ITask {
  verb = TaskVerb.idle;
  id = TaskVerb[this.verb];

  get icon(): string { return this.id; }

  updateState(state: IState, delta: number, count: number): void {}

  updateBuildOrder(
      buildOrderService: IBuildOrderService, currentTime: number): number {
    return currentTime;
  }
}

export class HarvestTask implements ITask {
  verb = TaskVerb.harvest;  
  object: string;
  id: string;

  constructor(public source: IResourceSource) {
    this.object = source.id;
    this.id = TaskVerb[this.verb] + ':' + this.object; 
  }

  get icon(): string { return this.object; }

  updateState(state: IState, delta: number, count: number): void {
     state.resources[this.source.resource] += 
        count * this.source.rate * delta;    
  }

  updateBuildOrder(
      buildOrderService: IBuildOrderService, currentTime: number): number {
    return currentTime;
  }
}

export interface ITaskCount {
  assignable: IAssignable;
  count: number;
  task: ITask;  
}

export interface IAssignment extends ITaskCount {
  apply(delta: number, state: IState): void;  
}

export interface IBuildOrderItem {
  start: number;
  isSpendingResources: boolean;

  apply(state: IState): void;
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

export interface IBuildOrderService {
  enqueueBuildable(
      buildable: Buildable, currentTime: number, 
      initialTask?: ITask): number
}

