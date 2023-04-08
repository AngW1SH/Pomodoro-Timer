export interface IPomodoro {
  id: number;
  title: string;
  description: string;
  repeats: number;
}

export enum Phase {
  Rest = "rest",
  Work = "work",
}

export enum Time {
  Rest = 5,
  Work = 2,
}

export enum EditActionKind {
  Title = "title",
  Description = "Description",
}

export interface EditAction {
  type: EditActionKind;
  payload: number;
}
