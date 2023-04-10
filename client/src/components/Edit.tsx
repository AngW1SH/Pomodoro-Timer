import React, { FC, useEffect, useRef, useState } from "react";
import { EditAction, EditActionKind, IPomodoro } from "../../types";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDebounce } from "../hooks/useDebounce";

interface EditProps {
  edited: IPomodoro | null;
  onChange: (edited: IPomodoro) => any;
  onComplete: (id: number) => any;
  onSave: (pomodoro: IPomodoro) => any;
  fetchesLeft: number;
}

const Edit: FC<EditProps> = ({
  edited,
  onChange,
  onComplete,
  onSave,
  fetchesLeft,
}) => {
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [synced, setSynced] = useState(true);

  const handleClose = () => {
    setOpened(false);
  };

  const onTitleChange = (e: ContentEditableEvent) => {
    if (edited) {
      onChange({ ...edited, title: e.target.value });
      setSynced(false);
    }
  };

  const onDescriptionChange = (e: ContentEditableEvent) => {
    if (edited) {
      onChange({ ...edited, description: e.target.value });
      setSynced(false);
    }
  };

  const onRepeatsDecrement = () => {
    if (edited && edited.repeats > 0) {
      onChange({ ...edited, repeats: edited.repeats - 1 });
      setSynced(false);
    }
  };

  const onRepeatsIncrement = () => {
    if (edited) {
      onChange({ ...edited, repeats: edited.repeats + 1 });
      setSynced(false);
    }
  };

  const handleComplete = () => {
    if (edited) {
      onComplete(edited.id);
    }
    setOpened(false);
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
      }
    }
  };

  const debouncedEdited = useDebounce(edited, 300);

  useEffect(() => {
    if (debouncedEdited) {
      onSave(debouncedEdited);
    }
  }, [debouncedEdited]);

  useEffect(() => {
    /*
    Potential Problems:
     - make sure a new object is always passed
       the editor won't open back if the same pomodoro is passed
    */

    if (edited) setOpened(true);
  }, [edited]);

  useEffect(() => {
    if (fetchesLeft == 0) setSynced(true);
  }, [fetchesLeft]);

  return (
    <div
      className={`fixed ${
        opened ? "right-0" : "sm:right[-75%] right-[-100%] md:right-[-40%]"
      } top-0 flex h-screen w-full flex-col justify-start border-l bg-white pl-6 pr-6 pt-20 transition-[right] duration-300 sm:w-9/12 md:w-4/12 md:border-l-0 md:pt-10`}
    >
      <div
        className={`absolute right-3 top-14 h-3 w-3 rounded-full md:top-3 ${
          synced ? "bg-green-300" : "bg-yellow-300"
        }`}
      />
      <ContentEditable
        onChange={onTitleChange}
        onKeyDown={handleTitleKeydown}
        html={edited ? edited.title : ""}
        placeholder="Title"
        className="relative mb-4 text-4xl outline-none before:hidden before:text-gray-600 empty:before:block empty:before:content-[attr(placeholder)]"
      />
      <ContentEditable
        innerRef={ref}
        onChange={onDescriptionChange}
        onKeyDown={handleDescriptionKeydown}
        html={edited ? edited.description : ""}
        placeholder="Description"
        className="relative outline-none before:hidden before:text-gray-600 empty:before:block empty:before:content-[attr(placeholder)]"
      />
      <div className="mb-10 mt-auto flex flex-col text-center">
        <div className="mb-3 flex border border-gray-400">
          <div className="h-full w-full border-r border-gray-400 px-2 py-2">
            Poms Left
          </div>
          <div className="flex w-full justify-between">
            <div
              onClick={onRepeatsDecrement}
              className="cursor-pointer select-none py-2 pl-4"
            >
              -
            </div>
            <div className="py-2">{edited ? edited.repeats : "0"}</div>
            <div
              onClick={onRepeatsIncrement}
              className="cursor-pointer select-none py-2 pr-4"
            >
              +
            </div>
          </div>
        </div>
        <div
          onClick={handleComplete}
          className="mb-3 border border-gray-400 px-10 py-2"
        >
          Mark as done
        </div>
      </div>
      <div
        className="absolute left-0 top-0 flex h-10 w-full items-center justify-center border-x bg-gray-100 after:block after:h-px after:w-7 after:bg-gray-400 hover:bg-gray-200 md:-left-10 md:h-full md:w-10 md:bg-white md:hover:bg-gray-100"
        onClick={handleClose}
      ></div>
    </div>
  );
};

export default Edit;
