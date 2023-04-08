import React, { FC, useEffect, useState } from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import { staticPomodoros } from "../components/static";
import { IPomodoro, Phase, Time } from "../../types";
import Edit from "../components/Edit";

interface MainProps {}

/* 
The purpose of only rendering the EditMenu once is to have the animations
without adding too much unnecessary state
*/

const EditWithMemo = React.memo(Edit, (props, newProps) => false);

const Main: FC<MainProps> = () => {
  const [phase, setPhase] = useState<Phase>(Phase.Work);
  const [initialTime, setInitialTime] = useState<Time>(Time.Work);
  const [edited, setEdited] = useState<IPomodoro | null>(null);
  const [pomodoros, setPomodoros] = useState(staticPomodoros);

  const onPomodoroClick = (pomodoro: IPomodoro) => {
    setEdited({ ...pomodoro });
  };

  useEffect(() => {
    if (edited) {
      setPomodoros(
        pomodoros.map((pomodoro) =>
          pomodoro.id == edited.id ? edited : pomodoro
        )
      );
    }
  }, [edited]);

  const changePhase = () => {
    if (phase == Phase.Rest) {
      setInitialTime(Time.Work);
      setPhase(Phase.Work);
    }
    if (phase == Phase.Work) {
      setInitialTime(Time.Rest);
      setPhase(Phase.Rest);
    }
  };

  const completeClosestPomodoro = () => {
    const completedIndex = pomodoros.findIndex(
      (pomodoro) => pomodoro.repeats > 0
    );

    if (completedIndex != -1) {
      setPomodoros(
        pomodoros.map((pomodoro, index) =>
          index == completedIndex
            ? { ...pomodoro, repeats: pomodoro.repeats - 1 }
            : pomodoro
        )
      );
    }
  };

  const onTimeout = () => {
    if (phase == Phase.Work) completeClosestPomodoro();
    changePhase();
  };
  return (
    <div className="flex h-screen">
      <Timer
        key={"" + initialTime + phase}
        initialTime={initialTime}
        callback={onTimeout}
        phase={phase}
      />
      <List onClick={onPomodoroClick} pomodoros={pomodoros} />
      <EditWithMemo edited={edited} onChange={setEdited} />
    </div>
  );
};

export default Main;
