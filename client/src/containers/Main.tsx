import React, { FC, createContext, useEffect, useState } from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import { staticPomodoros } from "../components/static";
import { IPomodoro, Phase, Time } from "../../types";
import Edit from "../components/Edit";
import {
  addPomodoro,
  deletePomodoro,
  getPomodoros,
  savePomodoro,
  updateOrder,
} from "../lib/pomodoro";
import Settings from "../components/Settings";
import { checkLoggedIn } from "../lib/login";

interface MainProps {}

/* 
The purpose of only rendering the EditMenu once is to have the animations
without adding too much unnecessary state
*/

export const LoggedInContext = createContext({
  loggedIn: true,
  setLoggedIn: (value: boolean) => {},
});

const EditWithMemo = React.memo(Edit, (props, newProps) => false);

const Main: FC<MainProps> = () => {
  const [phase, setPhase] = useState<Phase>(Phase.Work);
  const [initialTime, setInitialTime] = useState<Time>(Time.Work);
  const [edited, setEdited] = useState<IPomodoro | null>(null);
  const [pomodoros, setPomodoros] = useState<IPomodoro[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  const [fetchesLeft, setFetchesLeft] = useState(0);

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
      savePomodoro(
        {
          ...pomodoros[completedIndex],
          repeats: pomodoros[completedIndex].repeats - 1,
        },
        completedIndex
      );
    }
  };

  const onComplete = (id: number) => {
    deletePomodoro(id);
    setPomodoros(pomodoros.filter((pomodoro) => pomodoro.id != id));
  };

  const onAdd = () => {
    const newId =
      pomodoros.reduce(
        (maxId, pomodoro) => (maxId < pomodoro.id ? pomodoro.id : maxId),
        0
      ) + 1;
    const newPomodoro = { id: newId, title: "", description: "", repeats: 1 };
    setPomodoros([...pomodoros, newPomodoro]);
    setEdited(newPomodoro);
    addPomodoro(newPomodoro);
    updateOrder(pomodoros);
  };

  const onSave = (pomodoro: IPomodoro) => {
    setFetchesLeft((fetchesLeftPrev) => fetchesLeftPrev + 1);
    const order = pomodoros.findIndex(
      (pomMapped) => pomMapped.id == pomodoro.id
    );
    if (order != -1) {
      savePomodoro(pomodoro, order).then((result) =>
        setFetchesLeft((fetchesLeftPrev) => fetchesLeftPrev - 1)
      );
    }
  };

  const swapPomodoros = (pomodoros: IPomodoro[]) => {
    setPomodoros(pomodoros);
    updateOrder(pomodoros);
  };

  const onTimeout = () => {
    if (phase == Phase.Work) completeClosestPomodoro();
    changePhase();
  };

  const updateLoggedIn = async () => {
    const result = await checkLoggedIn();

    if (result != 200) {
      setLoggedIn(false);
    }
  };

  const fetchPomodoros = async () => {
    const pomodorosFromServer = await getPomodoros();
    setPomodoros(pomodorosFromServer);
    setInitialLoad(false);
  };

  useEffect(() => {
    updateLoggedIn();
    fetchPomodoros();
  }, []);

  useEffect(() => {
    if (!loggedIn) setPomodoros([]);
  }, [loggedIn]);

  return (
    <LoggedInContext.Provider
      value={{ loggedIn: loggedIn, setLoggedIn: setLoggedIn }}
    >
      <div className="flex h-screen flex-col md:flex-row">
        <Timer
          key={"" + initialTime + phase}
          initialTime={initialTime}
          callback={onTimeout}
          phase={phase}
        />
        <div className="mb-10 md:mb-0" />
        <List
          onClick={onPomodoroClick}
          isLoading={initialLoad}
          pomodoros={pomodoros}
          setPomodoros={swapPomodoros}
          onAdd={onAdd}
        />
        <EditWithMemo
          edited={edited}
          onComplete={onComplete}
          onChange={setEdited}
          onSave={onSave}
          fetchesLeft={fetchesLeft}
        />
        <Settings />
      </div>
    </LoggedInContext.Provider>
  );
};

export default Main;
