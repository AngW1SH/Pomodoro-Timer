import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timer";
import listReducer from "./list";
import miscReducer from "./misc";

const store = configureStore({
  reducer: {
    timer: timerReducer,
    pomodoros: listReducer,
    misc: miscReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
