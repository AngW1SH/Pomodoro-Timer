import React, { FC, createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./containers/Login";
import Main from "./containers/Main";
import useTheme from "./hooks/useTheme";
import { Provider } from "react-redux";
import store from "./redux/store";

interface AppProps {}

export const ThemeContext = createContext({
  prevTheme: localStorage.theme ? localStorage.theme : "white",
  setTheme: (theme: string) => {},
});

export const LoggedInContext = createContext({
  loggedIn: true,
  setLoggedIn: (value: boolean) => {},
});

const App: FC<AppProps> = () => {
  const [prevTheme, setTheme] = useTheme();
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ prevTheme, setTheme }}>
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Main />} />
            </Routes>
          </BrowserRouter>
        </LoggedInContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  );
};

export default App;
