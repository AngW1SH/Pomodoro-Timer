import React, { FC, useState } from "react";

import settingsIcon from "../assets/settings.svg";
import { Link } from "react-router-dom";

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const [opened, setOpened] = useState(false);

  const handleToggleOpen = () => {
    setOpened(!opened);
  };

  return (
    <React.Fragment>
      {opened && (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
          <div className="h-3/4 w-1/2 max-w-xl rounded-md border border-black bg-white p-10">
            <Link
              to={"/login"}
              className="mx-auto block w-3/4 cursor-pointer border border-black py-3 text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
      <div className="fixed left-3 top-3 h-8 w-8" onClick={handleToggleOpen}>
        <img
          className="h-full w-full cursor-pointer object-cover"
          src={settingsIcon}
          alt="settings"
        />
      </div>
    </React.Fragment>
  );
};

export default Settings;
