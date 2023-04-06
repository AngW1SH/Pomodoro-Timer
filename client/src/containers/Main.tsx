import React, { FC } from "react";
import Timer from "../components/Timer";
import List from "../components/List";

interface MainProps {}

const Main: FC<MainProps> = () => {
  const onTimeout = () => {};
  return (
    <div className="flex h-screen">
      <Timer initialTime={20} callback={onTimeout} />
      <List />
    </div>
  );
};

export default Main;
