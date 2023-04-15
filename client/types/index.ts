export interface IPomodoro {
  id: number;
  title: string;
  description: string;
  repeats: number;
}

export interface IPhase {
  name: string;
  initialTime: number;
}

export type IPhaseNames = {
  [key in PhaseKeys]: string;
};

export enum PhaseKeys {
  Work = "work",
  Rest = "rest",
}

export type IPhases = {
  [key in PhaseKeys]: IPhase;
};

export enum Time {
  Rest = 5 * 60,
  Work = 25 * 60,
}

export enum EditActionKind {
  Title = "title",
  Description = "Description",
}

export interface EditAction {
  type: EditActionKind;
  payload: number;
}
