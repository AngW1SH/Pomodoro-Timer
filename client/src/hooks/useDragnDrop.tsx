import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setEdited, updatePomodoros } from "../redux/list";
import { updateOrder } from "../lib/pomodoro";

export const useDragnDrop = () => {
  const dragRef = useRef<HTMLElement | null>(null);
  const dragInfo = useRef({
    isDragged: false,
    draggedIndex: -1,
    x: -1,
    y: -1,
    width: -1,
    newIndex: -1,
  });
  const [draggedIndex, setDraggedIndex] = useState(-1);

  const pomodoros = useAppSelector((state) => state.pomodoros.pomodoros);
  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector((state) => state.misc.loggedIn);

  const listRef = useRef<HTMLDivElement>(null);

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
          dispatch(
            updatePomodoros([
              ...pomodoros.filter(
                (pomodoro, index) => index != dragInfo.current.draggedIndex
              ),
              pomodoros[dragInfo.current.draggedIndex],
            ])
          );
        } else {
          const newPomodoros = pomodoros.map((pomodoro, index) =>
            index == dragInfo.current.draggedIndex
              ? { ...pomodoro, id: "-1" }
              : pomodoro
          );
          newPomodoros.splice(
            newIndex,
            0,
            pomodoros[dragInfo.current.draggedIndex]
          );
          dispatch(
            updatePomodoros(
              newPomodoros.filter((pomodoro) => pomodoro.id != "-1")
            )
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
          dispatch(setEdited(pomodoros[index]));
        }
      });
    } else if (dragInfo.current.isDragged) {
      const index = Array.from(e.currentTarget.children).findIndex(
        (child, index) => {
          return dragInfo.current.y < child.getBoundingClientRect().top;
        }
      );

      dispatch(updatePomodoros(pomodoros));
      updateOrder(pomodoros, loggedIn);
    }
  };

  return { dragInfo, listRef, handleDragStart, handleClick };
};
