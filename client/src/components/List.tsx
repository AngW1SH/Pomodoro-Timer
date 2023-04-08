import React, { FC } from "react";
import { IPomodoro } from "../../types";
import add from "../assets/add.svg";

interface ListProps {
  pomodoros: IPomodoro[];
  onClick: (pomodoro: IPomodoro) => any;
  onAdd: () => any;
}

const List: FC<ListProps> = ({ pomodoros, onClick, onAdd }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      Array.from(e.currentTarget.children).forEach((child, index) => {
        if (e.target == child || child.contains(e.target as HTMLElement)) {
          onClick(pomodoros[index]);
        }
      });
    }
  };

  return (
    <div className="relative h-full w-7/12 overflow-auto p-10">
      <div onClick={handleClick}>
        {pomodoros.map((pomodoro) => (
          <div
            key={pomodoro.id}
            className={`${
              pomodoro.repeats == 0 ? "bg-gray-200" : "bg-white"
            } relative mb-6 flex cursor-pointer items-end justify-center border border-black py-4`}
          >
            <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
              {pomodoro.title}
            </div>
            <div className="mr-20 overflow-hidden whitespace-nowrap">
              {pomodoro.description.replace(/(<([^>]+)>)/gi, " ")}
            </div>
            <div
              className={`${
                pomodoro.repeats == 0 ? "bg-gray-200" : "bg-white"
              } absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white`}
            >
              {pomodoro.repeats}
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={onAdd}
        className="absolute bottom-0 left-0 flex h-16 w-full cursor-pointer items-center justify-center bg-gray-100 hover:bg-gray-200"
      >
        <img src={add} alt="add a pomodoro" />
      </div>
    </div>
  );
};

export default List;
