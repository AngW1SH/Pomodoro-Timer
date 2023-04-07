import React, { FC } from "react";
import { IPomodoro } from "../../types";

interface ListProps {
  pomodoros: IPomodoro[];
}

const List: FC<ListProps> = ({ pomodoros }) => {
  return (
    <div className="h-full w-7/12 overflow-auto p-10">
      {pomodoros.map((pomodoro) => (
        <div className="relative mb-6 flex cursor-pointer items-end justify-center border border-black py-4">
          <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
            {pomodoro.title}
          </div>
          <div className="mr-20 overflow-hidden whitespace-nowrap">
            {pomodoro.description}
          </div>
          <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
            {pomodoro.repeats}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
