export interface IPomodoro {
  id: number;
  title: string;
  description: string;
  repeats: number;
}

export enum EditActionKind {
  Title = "title",
  Description = "Description",
}

export interface EditAction {
  type: EditActionKind;
  payload: number;
}
