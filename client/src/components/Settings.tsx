import React, { FC, useContext, useState } from "react";

import settingsIcon from "../assets/settings.svg";
import { Link } from "react-router-dom";
import { LoggedInContext } from "../containers/Main";
import { unauthorize } from "../lib/login";

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const [opened, setOpened] = useState(false);

  const handleToggleOpen = () => {
    setOpened(!opened);
  };

  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

  const handleLogOut = async () => {
    const result = await unauthorize();
    if (result == 200) {
      setLoggedIn(false);
      setOpened(false);
    }
  };

  return (
    <React.Fragment>
      {opened && (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
          <div className="h-3/4 w-1/2 max-w-xl rounded-md border border-black bg-white p-10">
            {!loggedIn && (
              <Link
                to={"/login"}
                className="mx-auto block w-3/4 cursor-pointer border border-black py-3 text-center"
              >
                Login
              </Link>
            )}
            {loggedIn && (
              <div
                onClick={handleLogOut}
                className="mx-auto w-3/4 cursor-pointer border border-black py-3 text-center"
              >
                Logout
              </div>
            )}
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
