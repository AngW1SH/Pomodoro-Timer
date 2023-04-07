import React, { FC, useEffect, useState } from "react";
import { IPomodoro } from "../../types";

interface EditProps {
  edited: IPomodoro | null;
}

const Edit: FC<EditProps> = ({ edited }) => {
  const [opened, setOpened] = useState(true);
  const [editedInner, setEditedInner] = useState(edited);

  const handleClose = () => {
    setOpened(false);
  };

  useEffect(() => {
    setTimeout(() => setOpened(true), 1);
  }, []);

  useEffect(() => {
    /*
    Potential Problems:
     - make sure a new object is always passed
       the editor won't open back if the same pomodoro is passed
    */
    setOpened(true);
    setEditedInner(edited);
  }, [edited]);

  return (
    <div
      className={`fixed ${
        opened ? "right-0" : "right-[-40%]"
      } top-0 h-screen w-4/12 bg-white pl-6 pt-4 transition-[right] duration-300`}
    >
      {editedInner ? editedInner.title : "Empty"}
      <div
        className="absolute -left-10 top-0 flex h-full w-10 items-center justify-center border-x bg-white after:block after:h-px after:w-7 after:bg-gray-400 hover:bg-gray-100"
        onClick={handleClose}
      ></div>
    </div>
  );
};

export default Edit;
