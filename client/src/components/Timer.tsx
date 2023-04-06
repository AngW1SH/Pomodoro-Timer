import React, { FC } from "react";

interface TimerProps {}

const Timer: FC<TimerProps> = () => {
  return (
    <div className="flex h-full w-5/12 flex-col items-center justify-center border-r border-black">
      <div className="mb-16 font-mono text-9xl tracking-wide">25:00</div>
      <div className="mb-4 w-52 cursor-pointer border border-black py-2 text-center capitalize">
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
