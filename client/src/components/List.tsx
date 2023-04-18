import React, { FC, useRef, useState } from "react";
import { IPomodoro } from "../../types";
import add from "../assets/add.svg";

interface ListProps {
  pomodoros: IPomodoro[];
  setPomodoros: (pomodoros: IPomodoro[], serverUpdate: boolean) => any;
  onClick: (pomodoro: IPomodoro) => any;
  onAdd: () => any;
  isLoading: boolean;
}

const List: FC<ListProps> = ({
  pomodoros,
  setPomodoros,
  onClick,
  onAdd,
  isLoading,
}) => {
  const dragInfo = useRef({
    isDragged: false,
    draggedIndex: -1,
    x: -1,
    y: -1,
    width: -1,
    newIndex: -1,
  });
  const dragRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [draggedIndex, setDraggedIndex] = useState(-1);

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      Array.from(e.currentTarget.children).forEach((child, index) => {
        if (e.target == child || child.contains(e.target as HTMLElement)) {
          const box = child.getBoundingClientRect();
          dragInfo.current = {
            isDragged: false,
            draggedIndex: index,
            x: box.left,
            y: box.top,
            width: child.clientWidth,
            newIndex: draggedIndex,
          };

          dragRef.current = child.children[0] as HTMLElement;
        }
      });
    }

    const positions = Array.from(listRef.current!.children).map(
      (child, index) => {
        return child.getBoundingClientRect().top;
      }
    );

    const handleDrag = (e: MouseEvent) => {
      const newIndex = positions.findIndex((rectTop, index) => {
        return dragInfo.current.y < rectTop;
      });

      dragInfo.current = {
        isDragged: true,
        draggedIndex: dragInfo.current.draggedIndex,
        x: dragInfo.current.x + e.movementX,
        y: dragInfo.current.y + e.movementY,
        width: dragInfo.current.width,
        newIndex: newIndex,
      };

      if (draggedIndex == -1) setDraggedIndex(dragInfo.current.draggedIndex);

      if (dragRef.current) {
        dragRef.current.style.position = "fixed";
        dragRef.current.style.top = dragInfo.current.y + "px";
        dragRef.current.style.left = dragInfo.current.x + "px";
        dragRef.current.style.width = dragInfo.current.width + "px";
        dragRef.current.style.zIndex = "100";
      }
      if (listRef.current) {
        if (newIndex == -1) {
          setPomodoros(
            [
              ...pomodoros.filter(
                (pomodoro, index) => index != dragInfo.current.draggedIndex
              ),
              pomodoros[dragInfo.current.draggedIndex],
            ],
            false
          );
        } else {
          const newPomodoros = pomodoros.map((pomodoro, index) =>
            index == dragInfo.current.draggedIndex
              ? { ...pomodoro, id: -1 }
              : pomodoro
          );
          newPomodoros.splice(
            newIndex,
            0,
            pomodoros[dragInfo.current.draggedIndex]
          );
          setPomodoros(
            newPomodoros.filter((pomodoro) => pomodoro.id != -1),
            false
          );
        }
      }
    };

    const handleDragStop = () => {
      dragInfo.current = {
        isDragged: false,
        draggedIndex: -1,
        x: -1,
        y: -1,
        width: -1,
        newIndex: -1,
      };

      if (dragRef.current) dragRef.current.removeAttribute("style");

      setDraggedIndex(-1);
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragStop);
    };

    if (dragInfo.current.draggedIndex != -1) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragStop);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!dragInfo.current.isDragged && e.target instanceof HTMLElement) {
      Array.from(e.currentTarget.children).forEach((child, index) => {
        if (e.target == child || child.contains(e.target as HTMLElement)) {
          onClick(pomodoros[index]);
        }
      });
    } else if (dragInfo.current.isDragged) {
      const index = Array.from(e.currentTarget.children).findIndex(
        (child, index) => {
          return dragInfo.current.y < child.getBoundingClientRect().top;
        }
      );

      setPomodoros(pomodoros, true);
    }
  };

  return (
    <div className="relative h-full w-full p-10 md:w-7/12 md:overflow-auto">
      <div
        ref={listRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleClick}
        className="h-full pb-10 md:pb-0"
      >
        {!isLoading &&
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
        onClick={onAdd}
        className="absolute bottom-0 left-0 flex h-16 w-full cursor-pointer items-center justify-center bg-gray-100 hover:bg-gray-200 dark:border-t dark:border-t-white dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img src={add} alt="add a pomodoro" />
      </div>
    </div>
  );
};

export default List;
