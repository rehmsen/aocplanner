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

  updateState(state: IState, delta: number, count: number): void
  enqueue(): void;
}

export class IdleTask implements ITask {
  verb = TaskVerb.idle;
  id = TaskVerb[this.verb];

  updateState(state: IState, delta: number, count: number): void {}

  enqueue(): void {}
}

export class HarvestTask implements ITask {
  verb = TaskVerb.harvest;  
  object: string;
  id: string;

  constructor(public source: IResourceSource) {
    this.object = source.id;
    this.id = TaskVerb[this.verb] + ':' + this.object; 
  }

  updateState(state: IState, delta: number, count: number): void {
     state.resources[this.source.resource] += 
        count * this.source.rate * delta;    
  }

  enqueue() : void{}
}

export interface ITaskCount {
  count: number;
  task: ITask;  
}

export interface IAssignment extends ITaskCount {
  apply(delta: number, state: IState): void;  
}

export interface IBuildOrderItem {
  start: number;

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

export interface IQueue {
  source: string;
  start: number;
  length: number;
  items: IBuildOrderItem[];
}

