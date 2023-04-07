import React, { FC, useState } from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import { staticPomodoros } from "../components/static";
import { IPomodoro } from "../../types";
import Edit from "../components/Edit";

interface MainProps {}

const EditWithMemo = React.memo(Edit, (props, newProps) => false);

const Main: FC<MainProps> = () => {
  const [edited, setEdited] = useState<IPomodoro | null>(null);
  const [pomodoros, setPomodoros] = useState(staticPomodoros);

  const onPomodoroClick = (pomodoro: IPomodoro) => {
    setEdited({ ...pomodoro });
  };

  const onTimeout = () => {};
  return (
    <div className="flex h-screen">
      <Timer initialTime={20} callback={onTimeout} />
      <List onClick={onPomodoroClick} pomodoros={pomodoros} />
      <EditWithMemo edited={edited} />
    </div>
  );
};

export default Main;
