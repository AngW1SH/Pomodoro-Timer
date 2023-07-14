import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPhase, PhaseKeys } from "../../types";
import { phases } from "../components/static";

export interface TimerState {
  checkpoint: {
    timeLeft: number;
    resumeTime: string;
  };
  time: number;
  stopped: boolean;
  phase: IPhase;
}

const initialState: TimerState = {
  checkpoint: {
    timeLeft: 25 * 60,
    resumeTime: new Date().toString(),
  },
  time: 25 * 60,
  stopped: true,
  phase: phases[PhaseKeys.Work],
};

export const timerSlice = createSlice({
  name: "Timer",
  initialState,
  reducers: {
    settime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },
    update: (state) => {
      state.time = Math.round(
        state.checkpoint.timeLeft -
          Math.round(
            new Date().getTime() -
              new Date(state.checkpoint.resumeTime).getTime()
          ) /
            1000
      );
    },
    setcheckpoint: (
      state,
      action: PayloadAction<{ timeLeft: number; resumeTime: string }>
    ) => {
      state.checkpoint = {
        timeLeft: action.payload.timeLeft,
        resumeTime: action.payload.resumeTime,
      };
    },
    toggleStopped: (state) => {
      state.stopped = !state.stopped;
    },
    stop: (state) => {
      state.stopped = true;
    },
    reset: (state) => {
      state.stopped = true;
      state.time = state.phase.initialTime;
      state.checkpoint = {
        timeLeft: state.phase.initialTime,
        resumeTime: new Date().toString(),
      };
    },
    changePhase: (state) => {
      state.stopped = true;
      if (state.phase.name == "rest") {
        state.phase = phases[PhaseKeys.Work];
        state.time = phases[PhaseKeys.Work].initialTime;
      } else if ((state.phase.name = "work")) {
        state.phase = phases[PhaseKeys.Rest];
        state.time = phases[PhaseKeys.Rest].initialTime;
      }
    },
  },
});

export const {
  settime,
  update,
  setcheckpoint,
  toggleStopped,
  stop,
  changePhase,
  reset,
} = timerSlice.actions;

export default timerSlice.reducer;
