import React, { FC } from "react";
import Timer from "../components/Timer";
import List from "../components/List";

interface MainProps {}

const Main: FC<MainProps> = () => {
  return (
    <div className="flex h-screen">
      <Timer />
      <List />
    </div>
  );
};

export default Main;
