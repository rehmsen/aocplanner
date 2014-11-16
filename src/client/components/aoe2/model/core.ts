export enum Resource {
  lumber,
  food,
  stone,
  gold
}

export class Resources {
  constructor(
      public lumber: number,
      public food: number,
      public stone: number,
      public gold: number) {}

  static create(object: any) {
    return new Resources(object.lumber, object.food, object.stone, object.gold)
  }
}

export interface IResourceSource {
  id: string;
  resource: Resource;
  rate: number;
}

export interface IState {
  time: number;
  resources: Resources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: IAssignment};
  hasBuilding: {[buildingId: string]: boolean};
  hasTechnology: {[technologyId: string]: boolean};
}

export enum TaskVerb {
  idle,
  harvest,
  construct
}

export class Task {
  constructor(public verb: TaskVerb, public object?: string) {
  }

  get id(): string {
    return TaskVerb[this.verb] + (this.object ? ':' + this.object : '');
  }

  static createIdle(): Task {
    return new Task(TaskVerb.idle);
  }
  static createHarvest(sourceId: string): Task {
    return new Task(TaskVerb.harvest, sourceId);
  }
}

export interface ITaskCount {
  count: number;
  task: Task;  
}

export interface IAssignment extends ITaskCount {
  apply(delta: number, state: IState): void;  
}

export interface IBuildOrderItem {
  start: number;

  apply(state: IState);
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

