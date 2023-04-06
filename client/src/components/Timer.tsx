import React, { FC } from "react";

interface TimerProps {}

const Timer: FC<TimerProps> = () => {
  return (
    <div className="flex justify-center flex-col items-center h-full w-5/12">
      <div className="text-9xl tracking-wide font-mono mb-16">25:00</div>
      <div className="w-52 py-2 mb-4 text-center border capitalize border-black">
        Stop Timer
      </div>
      <div className="w-52 py-2 mb-4 text-center border capitalize border-black">
        Stop Timer
      </div>
      <div className="w-52 py-2 mb-4 text-center border capitalize border-black">
        Stop Timer
      </div>
    </div>
  );
};

export default Timer;
