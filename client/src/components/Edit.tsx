import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { IPomodoro } from "../../types";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDebounce } from "../hooks/useDebounce";
import { LoggedInContext } from "../App";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  hideEdited,
  popPomodoro,
  setEdited,
  showEdited,
  updatePomodoros,
} from "../redux/list";
import { deletePomodoro, savePomodoro } from "../lib/pomodoro";
import { addFetch, removeFetch } from "../redux/misc";

interface EditProps {}

const Edit: FC<EditProps> = () => {
  const opened = useAppSelector((state) => state.pomodoros.editedOpened);
  const ref = useRef<HTMLDivElement>(null);
  const [synced, setSynced] = useState(true);

  const fetchesLeft = useAppSelector((state) => state.misc.fetchesLeft);

  const pomodoros = useAppSelector((state) => state.pomodoros.pomodoros);

  const edited = useAppSelector((state) => state.pomodoros.edited);
  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector((state) => state.misc.loggedIn);

  const controller = useRef(new AbortController());

  const handleClose = () => {
    dispatch(hideEdited());
  };

  const onTitleChange = (e: ContentEditableEvent) => {
    if (edited) {
      dispatch(setEdited({ ...edited, title: e.target.value }));
      setSynced(false);
    }
  };

  const onDescriptionChange = (e: ContentEditableEvent) => {
    if (edited) {
      dispatch(setEdited({ ...edited, description: e.target.value }));
      setSynced(false);
    }
  };

  const onRepeatsDecrement = () => {
    if (edited && edited.repeats > 0) {
      dispatch(setEdited({ ...edited, repeats: edited.repeats - 1 }));
      setSynced(false);
    }
  };

  const onRepeatsIncrement = () => {
    if (edited) {
      dispatch(setEdited({ ...edited, repeats: edited.repeats + 1 }));
      setSynced(false);
    }
  };

  const handleComplete = () => {
    if (edited) {
      deletePomodoro(edited.id, loggedIn);
      dispatch(popPomodoro(edited.id));
    }
    dispatch(hideEdited());
  };

  const handleTitleKeydown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") e.preventDefault();
  };
  
  const handleDescriptionKeydown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter" && e.shiftKey == false && ref.current) {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        const endOfLine =
          range.endOffset === range.endContainer.textContent!.length;
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
        if (endOfLine) {
          ref.current.appendChild(document.createElement("br"));
        }
        dispatch(
          setEdited({
            ...edited!,
            description: (e.target as HTMLDivElement).innerHTML,
          })
        ); // for debouncedEdited
      }
    }
  };

  const debouncedEdited = useDebounce(edited, 300);

  useEffect(() => {
    if (debouncedEdited) {
      onSave(debouncedEdited);
    }
  }, [debouncedEdited]);

  const onSave = (pomodoro: IPomodoro) => {
    dispatch(addFetch());
    const order = pomodoros.findIndex(
      (pomMapped) => pomMapped.id == pomodoro.id
    );
    if (order != -1) {
      controller.current.abort();
      controller.current = new AbortController();
      savePomodoro(pomodoro, order, loggedIn, controller.current).then(
        (result) => dispatch(removeFetch())
      );
    }
  };

  useEffect(() => {
    if (edited) {
      if (!opened) dispatch(showEdited());
      dispatch(
        updatePomodoros(
          pomodoros.map((pomodoro) =>
            pomodoro.id == edited.id ? edited : pomodoro
          )
        )
      );
    }
  }, [edited]);

  useEffect(() => {
    if (fetchesLeft == 0) setSynced(true);
  }, [fetchesLeft]);

  return (
    <div
      className={`fixed ${
        opened ? "right-0" : "sm:right[-75%] right-[-100%] md:right-[-40%]"
      } top-0 flex h-screen w-full flex-col justify-start border-l bg-white pl-6 pr-6 pt-20 transition-[right] duration-300 dark:bg-black dark:text-white sm:w-9/12 md:w-4/12 md:border-l-0 md:pt-10`}
    >
      {loggedIn && (
        <div
          className={`absolute right-3 top-14 h-3 w-3 rounded-full md:top-3 ${
            synced ? "bg-green-300" : "bg-yellow-300"
          }`}
        />
      )}
      <ContentEditable
        onChange={onTitleChange}
        onKeyDown={handleTitleKeydown}
        html={edited ? edited.title : ""}
        placeholder="Title"
        className="relative mb-4 text-4xl outline-none before:hidden before:text-gray-600 empty:before:block empty:before:content-[attr(placeholder)] dark:before:text-gray-400"
      />
      <ContentEditable
        innerRef={ref}
        onChange={onDescriptionChange}
        onKeyDown={handleDescriptionKeydown}
        html={edited ? edited.description : ""}
        placeholder="Description"
        className="relative outline-none before:hidden before:text-gray-600 empty:before:block empty:before:content-[attr(placeholder)] dark:before:text-gray-400"
      />
      <div className="mb-10 mt-auto flex flex-col text-center">
        <div className="mb-3 flex border border-gray-400">
          <div className="h-full w-full border-r border-gray-400 px-2 py-2">
            Poms Left
          </div>
          <div className="flex w-full items-center justify-between">
            <div
              onClick={onRepeatsDecrement}
              className="cursor-pointer select-none py-1 pl-2"
            >
              <div className="box-border flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                -
              </div>
            </div>
            <div className="py-2">{edited ? edited.repeats : "0"}</div>
            <div
              onClick={onRepeatsIncrement}
              className="cursor-pointer select-none py-1 pr-2"
            >
              <div className="box-border flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                +
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={handleComplete}
          className="mb-3 cursor-pointer border border-gray-400 px-10 py-2 hover:bg-gray-100 dark:border-white dark:bg-black dark:hover:bg-gray-700"
        >
          Mark as done
        </div>
      </div>
      <div
        className="absolute left-0 top-0 flex h-10 w-full items-center justify-center border-x bg-gray-100 after:block after:h-px after:w-7 after:bg-gray-400 hover:bg-gray-200 dark:bg-black dark:after:bg-white dark:hover:bg-gray-700 md:-left-10 md:h-full md:w-10 md:bg-white md:hover:bg-gray-100"
        onClick={handleClose}
      ></div>
    </div>
  );
};

export default Edit;
