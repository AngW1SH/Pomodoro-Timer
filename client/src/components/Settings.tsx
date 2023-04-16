import React, { FC, useContext, useEffect, useRef, useState } from "react";

import settingsIcon from "../assets/settings.svg";
import { Link } from "react-router-dom";
import { LoggedInContext } from "../containers/Main";
import { unauthorize } from "../lib/login";
import { Transition } from "@headlessui/react";

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const [opened, setOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

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
  const handleClickAway = (e: MouseEvent) => {
    if (
      ref.current &&
      e.target instanceof HTMLElement &&
      ref.current == e.target // ref.current is the transparent background
    ) {
      setOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickAway);

    return () => {
      document.removeEventListener("click", handleClickAway);
    };
  }, []);

  return (
    <React.Fragment>
      <Transition
        show={opened}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={ref}
          className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center"
        >
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
      </Transition>
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
