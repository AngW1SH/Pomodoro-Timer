import React, { FC, useEffect, useRef, useState } from "react";
import add from "../assets/add.svg";
import { addPomodoro, updateOrder } from "../lib/pomodoro";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { pushPomodoro, setEdited, updatePomodoros } from "../redux/list";
import { useDragnDrop } from "../hooks/useDragnDrop";

interface ListProps {
  isLoading: boolean;
}

const List: FC<ListProps> = ({ isLoading }) => {
  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector((state) => state.misc.loggedIn);
  const pomodoros = useAppSelector((state) => state.pomodoros.pomodoros);

  const { dragInfo, listRef, handleDragStart, handleClick } = useDragnDrop();

  const handleAddPomodoro = async () => {
    const newPomodoro = {
      id: "-1",
      title: "",
      description: "",
      repeats: 1,
    };

    const result = await addPomodoro(newPomodoro, loggedIn);

    if (result.id == "-1") {
      const newId = pomodoros.reduce(
        (acc, cur) => (acc > +cur.id ? +cur.id : acc),
        0
      );
      dispatch(pushPomodoro({ ...result, id: "" + (newId - 1) }));
    } else {
      dispatch(pushPomodoro(result));
    }
  };

  useEffect(() => {
    if (!loggedIn) dispatch(updatePomodoros([]));
  }, [loggedIn]);

  return (
    <div className="relative h-full w-full p-10 md:w-7/12 md:overflow-auto">
      <div
        ref={listRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleClick}
        className="h-full pb-10 md:pb-0"
      >
        {(!isLoading || !loggedIn) &&
          pomodoros.map((pomodoro, index) => (
            <div key={pomodoro.id} className="h-24">
              <div
                className={`${
                  pomodoro.repeats == 0
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "group bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700"
                } ${
                  dragInfo.current.draggedIndex != -1 ? "select-none" : ""
                } relative mb-8 flex h-16 cursor-pointer items-end justify-start overflow-hidden border border-black py-4 dark:border-white dark:bg-black dark:text-white md:justify-center`}
              >
                <div
                  className="ml-4 mr-5 whitespace-nowrap text-xl font-bold"
                  dangerouslySetInnerHTML={{
                    __html: pomodoro.title.replace(/(<([^>]+)>|&nbsp;)/gi, " "),
                  }}
                ></div>
                <div
                  className="mr-20 overflow-hidden whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: pomodoro.description.replace(
                      /(<([^>]+)>|&nbsp;)/gi,
                      " "
                    ),
                  }}
                ></div>
                <div
                  className={`${
                    pomodoro.repeats == 0
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "bg-white group-hover:bg-gray-100 dark:bg-black dark:group-hover:bg-gray-700"
                  } absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black dark:border-white`}
                >
                  {pomodoro.repeats}
                </div>
              </div>
            </div>
          ))}
      </div>
      {!isLoading && !pomodoros.length && (
        <div className="pointer-events-none absolute left-0 top-0 -mt-10 flex h-full w-full items-center justify-center text-5xl font-light leading-snug text-gray-400">
          All done,
          <br /> good job!
        </div>
      )}
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="b-4 b-gray-400 h-10 w-10"></div>
        </div>
      )}
      <div
        onClick={handleAddPomodoro}
        className="absolute bottom-0 left-0 flex h-16 w-full cursor-pointer items-center justify-center bg-gray-100 hover:bg-gray-200 dark:border-t dark:border-t-white dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img src={add} alt="add a pomodoro" />
      </div>
    </div>
  );
};

export default List;
