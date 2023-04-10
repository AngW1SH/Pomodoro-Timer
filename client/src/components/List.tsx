import React, { FC, useRef, useState } from "react";
import { IPomodoro } from "../../types";
import add from "../assets/add.svg";

interface ListProps {
  pomodoros: IPomodoro[];
  setPomodoros: (pomodoros: IPomodoro[]) => any;
  onClick: (pomodoro: IPomodoro) => any;
  onAdd: () => any;
}

function getCoords(elem: Element) {
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

const List: FC<ListProps> = ({ pomodoros, setPomodoros, onClick, onAdd }) => {
  const dragInfo = useRef({
    isDragged: false,
    draggedIndex: -1,
    x: -1,
    y: -1,
    width: -1,
  });
  const dragRef = useRef<HTMLElement | null>(null);

  const [draggedIndex, setDraggedIndex] = useState(-1);

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      Array.from(e.currentTarget.children).forEach((child, index) => {
        if (e.target == child || child.contains(e.target as HTMLElement)) {
          dragInfo.current = {
            isDragged: false,
            draggedIndex: index,
            x: getCoords(child).left,
            y: getCoords(child).top,
            width: child.clientWidth,
          };

          dragRef.current = child.children[0] as HTMLElement;
        }
      });
    }

    const handleDrag = (e: MouseEvent) => {
      dragInfo.current = {
        isDragged: true,
        draggedIndex: dragInfo.current.draggedIndex,
        x: dragInfo.current.x + e.movementX,
        y: dragInfo.current.y + e.movementY,
        width: dragInfo.current.width,
      };

      if (draggedIndex == -1) setDraggedIndex(dragInfo.current.draggedIndex);

      if (dragRef.current) {
        dragRef.current.style.position = "fixed";
        dragRef.current.style.top = dragInfo.current.y + "px";
        dragRef.current.style.left = dragInfo.current.x + "px";
        dragRef.current.style.width = dragInfo.current.width + "px";
        dragRef.current.style.zIndex = "100";
      }
    };

    const handleDragStop = () => {
      dragInfo.current = {
        isDragged: false,
        draggedIndex: -1,
        x: -1,
        y: -1,
        width: -1,
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
          return dragInfo.current.y < getCoords(child).top;
        }
      );

      if (index == -1) {
        setPomodoros([
          ...pomodoros.filter(
            (pomodoro, indexMapped) =>
              indexMapped != dragInfo.current.draggedIndex
          ),
          pomodoros[dragInfo.current.draggedIndex],
        ]);
      } else {
        const newPomodoros = pomodoros.map((pomodoro, index) =>
          index == dragInfo.current.draggedIndex
            ? { ...pomodoro, id: -1 }
            : pomodoro
        );
        newPomodoros.splice(index, 0, pomodoros[dragInfo.current.draggedIndex]);
        setPomodoros(newPomodoros.filter((pomodoro) => pomodoro.id != -1));
      }
    }
  };

  return (
    <div className="relative h-full w-7/12 overflow-auto p-10">
      <div
        onMouseDown={handleDragStart}
        onMouseUp={handleClick}
        className="h-full"
      >
        {pomodoros.map((pomodoro, index) => (
          <div key={pomodoro.id} className="h-24">
            <div
              className={`${
                pomodoro.repeats == 0 ? "bg-gray-200" : "bg-white"
              } relative mb-8 flex h-16 cursor-pointer items-end justify-center border border-black py-4`}
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
                  pomodoro.repeats == 0 ? "bg-gray-200" : "bg-white"
                } absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white`}
              >
                {pomodoro.repeats}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!pomodoros.length && (
        <div className="pointer-events-none absolute left-0 top-0 -mt-10 flex h-full w-full items-center justify-center text-5xl font-light leading-snug text-gray-400">
          All done,
          <br /> good job!
        </div>
      )}
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
