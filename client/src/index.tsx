import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./containers/Main";

document.title = "Document";

const root = ReactDOM.createRoot(document.querySelector("#root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  </BrowserRouter>
);
