import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPomodoro } from "../../types";

export interface ListState {
  pomodoros: IPomodoro[];
  edited: IPomodoro | null;
  editedOpened: boolean;
}

const initialState: ListState = {
  pomodoros: [],
  edited: null,
  editedOpened: false,
};

export const listSlice = createSlice({
  name: "pomodoros",
  initialState,
  reducers: {
    pushPomodoro: (state, action: PayloadAction<IPomodoro>) => {
      state.pomodoros = [...state.pomodoros, action.payload];
      state.edited = action.payload;
      state.editedOpened = true;
    },
    updatePomodoros: (state, action: PayloadAction<IPomodoro[]>) => {
      state.pomodoros = action.payload;
    },
    setEdited: (state, action: PayloadAction<IPomodoro>) => {
      state.edited = action.payload;
      state.editedOpened = true;
    },
    popPomodoro: (state, action: PayloadAction<string>) => {
      state.pomodoros = state.pomodoros.filter(
        (pomodoro) => pomodoro.id != action.payload
      );
    },
    showEdited: (state) => {
      state.editedOpened = true;
    },
    hideEdited: (state) => {
      state.editedOpened = false;
    },
  },
});

export const {
  pushPomodoro,
  updatePomodoros,
  setEdited,
  popPomodoro,
  showEdited,
  hideEdited,
} = listSlice.actions;

export default listSlice.reducer;
