import React, { FC, useEffect, useRef, useState } from "react";
import { IPhase, PhaseKeys, Time } from "../../types";
import { phaseNames } from "./static";

interface TimerProps {
  initialTime: Time;
  callback: () => any;
  phase: string;
}

const Timer: FC<TimerProps> = ({ initialTime, callback, phase }) => {
  const [time, setTime] = useState(initialTime);
  const [stopped, setStopped] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (timeToFormat: number) => {
    const minutes: string =
      Math.floor(timeToFormat / 60) < 10
        ? "0" + Math.floor(timeToFormat / 60)
        : "" + Math.floor(timeToFormat / 60);
    const seconds: string =
      timeToFormat % 60 < 10
        ? "0" + (timeToFormat % 60)
        : "" + (timeToFormat % 60);

    return minutes + ":" + seconds;
  };

  const updateTime = (time: number) => {
    if (time < 0) {
      if (timer.current) clearInterval(timer.current);
      callback();
    } else {
      setTime((time) => time - 1);
    }
  };

  const handleStop = () => {
    if (!stopped) {
      if (timer.current) clearInterval(timer.current);
    } else {
      launchTimer(time - 1); // I found immediate timer resume to be more intuitive
    }
    setStopped(!stopped);
  };

  const handleSkip = () => {
    callback();
  };

  const handleReset = () => {
    if (timer.current) clearInterval(timer.current);
    setTime(initialTime);
    setStopped(true);
  };

  const launchTimer = (initialTime: number) => {
    setTime(initialTime);
    let timeClosure = initialTime; // look up react state closure
    timer.current = setInterval(() => {
      timeClosure -= 1;
      updateTime(timeClosure);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center border-b border-black pb-12 dark:border-white md:w-5/12 md:border-b-0 md:border-r md:pb-0">
      <div className="mb-12 mt-12 text-5xl md:-mt-6">
        {phase == phaseNames[PhaseKeys.Work] ? "Focus" : "Rest"}
      </div>
      <div className="lg:text-9x mb-16 font-mono text-8xl tracking-wide dark:text-white xs:text-9xl md:text-8xl">
        {time >= 0 ? formatTime(time) : "00:00"}
      </div>
      <div
        onClick={handleStop}
        className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
      >
        {stopped ? "Start Timer" : "Stop Timer"}
      </div>
      <div
        onClick={handleSkip}
        className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
      >
        Skip {phase == phaseNames[PhaseKeys.Work] && "pomodoro"}{" "}
        {phase == phaseNames[PhaseKeys.Rest] && "rest"}
      </div>
      <div
        onClick={handleReset}
        className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
      >
        Reset {phase == phaseNames[PhaseKeys.Work] && "pomodoro"}{" "}
        {phase == phaseNames[PhaseKeys.Rest] && "rest"}
      </div>
    </div>
  );
};

export default Timer;
