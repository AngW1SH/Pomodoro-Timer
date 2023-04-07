import React, { FC, useState } from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import { staticPomodoros } from "../components/static";

interface MainProps {}

const Main: FC<MainProps> = () => {
  const [pomodoros, setPomodoros] = useState(staticPomodoros);
  const onTimeout = () => {};
  return (
    <div className="flex h-screen">
      <Timer initialTime={20} callback={onTimeout} />
      <List pomodoros={pomodoros} />
    </div>
  );
};

export default Main;
