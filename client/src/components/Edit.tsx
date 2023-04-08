import React, { FC, useEffect, useState } from "react";
import { EditAction, EditActionKind, IPomodoro } from "../../types";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface EditProps {
  edited: IPomodoro | null;
  onChange: (edited: IPomodoro) => any;
  onComplete: (id: number) => any;
}

const Edit: FC<EditProps> = ({ edited, onChange, onComplete }) => {
  const [opened, setOpened] = useState(false);
  const [editedInner, setEditedInner] = useState(edited);

  const handleClose = () => {
    setOpened(false);
  };

  const onTitleChange = (e: ContentEditableEvent) => {
    if (editedInner) {
      onChange({ ...editedInner, title: e.target.value });
    }
  };

  const onDescriptionChange = (e: ContentEditableEvent) => {
    if (editedInner) {
      onChange({ ...editedInner, description: e.target.value });
    }
  };

  const onRepeatsDecrement = () => {
    if (editedInner && editedInner.repeats > 0) {
      onChange({ ...editedInner, repeats: editedInner.repeats - 1 });
    }
  };

  const onRepeatsIncrement = () => {
    if (editedInner) {
      onChange({ ...editedInner, repeats: editedInner.repeats + 1 });
    }
  };

  const handleComplete = () => {
    if (editedInner) {
      onComplete(editedInner.id);
    }
    setOpened(false);
  };

  useEffect(() => {
    /*
    Potential Problems:
     - make sure a new object is always passed
       the editor won't open back if the same pomodoro is passed
    */
    if (edited) setOpened(true);
    setEditedInner(edited);
  }, [edited]);

  return (
    <div
      className={`fixed ${
        opened ? "right-0" : "right-[-40%]"
      } top-0 flex h-screen w-4/12 flex-col justify-start bg-white pl-6 pr-6 pt-10 transition-[right] duration-300`}
    >
      <ContentEditable
        onChange={onTitleChange}
        html={edited ? edited.title : ""}
        placeholder="Title"
        className="relative mb-4 text-4xl outline-none before:hidden before:text-gray-600 empty:before:block empty:before:content-[attr(placeholder)]"
      />
      <ContentEditable
        onChange={onDescriptionChange}
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
        <div className="border border-gray-400 px-10 py-2">Save</div>
      </div>
      <div
        className="absolute -left-10 top-0 flex h-full w-10 items-center justify-center border-x bg-white after:block after:h-px after:w-7 after:bg-gray-400 hover:bg-gray-100"
        onClick={handleClose}
      ></div>
    </div>
  );
};

export default Edit;
