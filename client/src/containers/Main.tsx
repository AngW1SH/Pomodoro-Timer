import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Timer from "../components/Timer";
import List from "../components/List";
import { phases, staticPomodoros } from "../components/static";
import { IPhase, IPomodoro, PhaseKeys, Time } from "../../types";
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
import { LoggedInContext } from "../App";

interface MainProps {}

/* 
The purpose of only rendering the EditMenu once is to have the animations
without adding too much unnecessary state
*/

const EditWithMemo = React.memo(Edit, (props, newProps) => false);

const Main: FC<MainProps> = () => {
  const [phase, setPhase] = useState<IPhase>(phases[PhaseKeys.Work]);
  const [edited, setEdited] = useState<IPomodoro | null>(null);
  const [pomodoros, setPomodoros] = useState<IPomodoro[]>([]);
  /*
  it may not be the worst idea to have a specific 'pomodoros' array that will indicate that
  the pomodoros have not been loaded for the first time yet
  */
  const [initialLoad, setInitialLoad] = useState(true);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

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
    if (phase.name == "rest") {
      setPhase(phases[PhaseKeys.Work]);
    }
    if (phase.name == "work") {
      setPhase(phases[PhaseKeys.Rest]);
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

  const onComplete = (id: string) => {
    deletePomodoro(id);
    setPomodoros(pomodoros.filter((pomodoro) => pomodoro.id != id));
  };

  const onAdd = async () => {
    const newPomodoro = {
      id: "-1",
      title: "",
      description: "",
      repeats: 1,
    };
    const result = await addPomodoro(newPomodoro);
    setPomodoros((pomodoros) => [...pomodoros, result]);
    updateOrder(pomodoros);
    setEdited(result);
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

  const swapPomodoros = (pomodoros: IPomodoro[], serverUpdate: boolean) => {
    setPomodoros(pomodoros);
    if (serverUpdate) updateOrder(pomodoros);
  };

  const onTimeout = () => {
    if (phase.name == "work") completeClosestPomodoro();
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
    <div className="flex h-screen flex-col dark:bg-black md:flex-row">
      <Timer
        key={"" + phase.initialTime + phase}
        initialTime={phase.initialTime}
        callback={onTimeout}
        phase={phase.name}
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
  );
};

export default Main;
