import React, { FC, useEffect, useRef, useState } from "react";

interface TimerProps {
  initialTime: number;
  callback: () => any;
}

const Timer: FC<TimerProps> = ({ initialTime, callback }) => {
  const [time, setTime] = useState(initialTime);
  const [stopped, setStopped] = useState(false);
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
      updateTime(time); // I found immediate timer resume to be more intuitive
      launchTimer(time - 1);
    }
    setStopped(!stopped);
  };

  const launchTimer = (initialTime: number) => {
    let timeClosure = initialTime; // look up react state closure
    timer.current = setInterval(() => {
      timeClosure -= 1;
      updateTime(timeClosure);
    }, 1000);
  };

  useEffect(() => {
    launchTimer(initialTime);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="flex h-full w-5/12 flex-col items-center justify-center border-r border-black">
      <div className="mb-16 font-mono text-9xl tracking-wide">
        {time >= 0 ? formatTime(time) : "00:00"}
      </div>
      <div
        onClick={handleStop}
        className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize"
      >
        Stop Timer
      </div>
      <div className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize">
        Skip Pomodoro
      </div>
      <div className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize">
        Reset Pomodoro
      </div>
    </div>
  );
};

export default Timer;
