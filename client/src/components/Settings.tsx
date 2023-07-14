import React, { FC, useEffect, useRef, useState } from "react";

import settingsIcon from "../assets/settings.svg";
import { Link } from "react-router-dom";
import { unauthorize } from "../lib/login";
import { Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, toggleTheme } from "../redux/misc";

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const [opened, setOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const theme = useAppSelector((state) => state.misc.theme);

  const dispatch = useAppDispatch();

  const handleToggleOpen = () => {
    setOpened(!opened);
  };

  const loggedIn = useAppSelector((state) => state.misc.loggedIn);

  const handleLogOut = async () => {
    const result = await unauthorize();
    if (result == 200) {
      dispatch(logout());
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

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
          <div className="h-3/4 w-11/12 max-w-xl rounded-md border border-black bg-white p-10 dark:border-white dark:bg-black dark:text-white md:w-1/2">
            {!loggedIn && (
              <Link
                to={"/login"}
                className="mx-auto mb-6 block cursor-pointer border border-black py-3 text-center dark:border-white dark:bg-black dark:text-white md:w-3/4"
              >
                Login
              </Link>
            )}
            {loggedIn && (
              <div
                onClick={handleLogOut}
                className="mx-auto mb-6 cursor-pointer border border-black py-3 text-center dark:border-white dark:bg-black dark:text-white md:w-3/4"
              >
                Logout
              </div>
            )}
            <div
              onClick={handleToggleTheme}
              className="mx-auto cursor-pointer border border-black py-3 text-center dark:border-white dark:bg-black dark:text-white md:w-3/4"
            >
              Toggle Theme
            </div>
          </div>
        </div>
      </Transition>
      <div className="fixed left-3 top-3 h-8 w-8" onClick={handleToggleOpen}>
        <img
          className="h-full w-full cursor-pointer object-cover dark:invert"
          src={settingsIcon}
          alt="settings"
        />
      </div>
    </React.Fragment>
  );
};

export default Settings;
