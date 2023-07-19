import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MiscState {
  loggedIn: boolean;
  theme: string;
  fetchesLeft: number;
}

const initialState: MiscState = {
  loggedIn: false,
  theme: localStorage.theme ? localStorage.theme : "light",
  fetchesLeft: 0,
};

const miscSlice = createSlice({
  name: "Misc",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme == "light" ? "dark" : "light";
    },
    login: (state) => {
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
    addFetch: (state) => {
      state.fetchesLeft += 1;
    },
    removeFetch: (state) => {
      state.fetchesLeft -= 1;
    },
  },
});

export const { toggleTheme, login, logout, addFetch, removeFetch } =
  miscSlice.actions;

export default miscSlice.reducer;
