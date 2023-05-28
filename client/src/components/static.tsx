import { IPhaseNames, IPhases, IPomodoro, PhaseKeys } from "../../types";

export const phaseNames: IPhaseNames = {
  [PhaseKeys.Work]: "work",
  [PhaseKeys.Rest]: "rest",
};

export const phases: IPhases = {
  [PhaseKeys.Work]: {
    name: phaseNames[PhaseKeys.Work],
    initialTime: 25 * 60,
  },
  [PhaseKeys.Rest]: {
    name: phaseNames[PhaseKeys.Rest],
    initialTime: 5 * 60,
  },
};

export const staticPomodoros: IPomodoro[] = [
  {
    id: "1",
    title: "Title1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perferendis ea illum deserunt repudiandae excepturi quisquam debitis assumenda sed exercitationem.",
    repeats: 2,
  },
  {
    id: "2",
    title: "Title2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perferendis ea illum deserunt repudiandae excepturi quisquam debitis assumenda sed exercitationem.",
    repeats: 2,
  },
  {
    id: "3",
    title: "Title3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perferendis ea illum deserunt repudiandae excepturi quisquam debitis assumenda sed exercitationem.",
    repeats: 2,
  },
  {
    id: "4",
    title: "Title4",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perferendis ea illum deserunt repudiandae excepturi quisquam debitis assumenda sed exercitationem.",
    repeats: 2,
  },
  {
    id: "5",
    title: "Title5",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perferendis ea illum deserunt repudiandae excepturi quisquam debitis assumenda sed exercitationem.",
    repeats: 2,
  },
];
