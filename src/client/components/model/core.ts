export interface IAssignment {
  count: number;
  task: string;
  apply(delta: number, state: State): void;  
}

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
  resources: Resources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: IAssignment};
}

export class State implements IState {
  constructor(
      public resources: Resources,
      public pop: number,
      public popCap: number,
      public assignments: {[task: string]: IAssignment}) {}
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