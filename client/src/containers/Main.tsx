import React, { FC, useEffect, useState } from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import Edit from "../components/Edit";
import { getPomodoros, savePomodoro } from "../lib/pomodoro";
import Settings from "../components/Settings";
import { checkLoggedIn } from "../lib/login";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updatePomodoros } from "../redux/list";
import { login } from "../redux/misc";

interface MainProps {}

const Main: FC<MainProps> = () => {
  const pomodoros = useAppSelector((state) => state.pomodoros.pomodoros);
  const phase = useAppSelector((state) => state.timer.phase);
  const loggedIn = useAppSelector((state) => state.misc.loggedIn);
  const dispatch = useAppDispatch();

  const [initialLoad, setInitialLoad] = useState(true);

  const updateLoggedIn = async () => {
    const result = await checkLoggedIn();

    if (result == 200) {
      dispatch(login());
      const pomodorosFromServer = await getPomodoros(true);
      dispatch(updatePomodoros(pomodorosFromServer));
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    updateLoggedIn();
  }, []);

  const completeClosestPomodoro = () => {
    const completedIndex = pomodoros.findIndex(
      (pomodoro) => pomodoro.repeats > 0
    );

    if (completedIndex != -1) {
      dispatch(
        updatePomodoros(
          pomodoros.map((pomodoro, index) =>
            index == completedIndex
              ? { ...pomodoro, repeats: pomodoro.repeats - 1 }
              : pomodoro
          )
        )
      );
      savePomodoro(
        {
          ...pomodoros[completedIndex],
          repeats: pomodoros[completedIndex].repeats - 1,
        },
        completedIndex,
        loggedIn
      );
    }
  };

  useEffect(() => {
    if (phase.name == "rest") completeClosestPomodoro();
  }, [phase]);

  return (
    <div className="flex h-screen flex-col dark:bg-black md:flex-row">
      <Timer />
      <div className="mb-10 md:mb-0" />
      <List isLoading={initialLoad} />
      <Edit />
      <Settings />
    </div>
  );
};

export default Main;
