import { useContext } from "react";
import { IPomodoro } from "../../types";
import { LoggedInContext } from "../App";

const authorizedFetch = async <Type>(url: RequestInfo, init?: RequestInit) => {
  const result = await fetch(url, init);
  if (result.status == 205) return await fetch(url, init);
  return result;
};

export const addPomodoro = async (
  pomodoro: IPomodoro,
  loggedIn: boolean
): Promise<IPomodoro> => {
  if (loggedIn) {
    const result = await authorizedFetch("/api/add", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pomodoro: pomodoro,
      }),
    }).then((response) => response.json());

    return result;
  }

  return {
    id: "-1",
    title: "",
    description: "",
    repeats: 1,
  };
};

export const savePomodoro = async (
  pomodoro: IPomodoro,
  order: number,
  loggedIn: boolean
) => {
  if (loggedIn) {
    const result = await authorizedFetch("/api/save", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pomodoro: { ...pomodoro, order: order },
      }),
    }).then((response) => response.json());

    return result;
  }
};

export const deletePomodoro = async (id: string, loggedIn: boolean) => {
  if (loggedIn) {
    const result = await authorizedFetch("/api/delete", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    }).then((response) => response.json());

    return result;
  }
};

export const getPomodoros = async (loggedIn: boolean) => {
  if (loggedIn) {
    const result = await authorizedFetch("/api/get").then((response) =>
      response.status == 200 ? response.json() : []
    );

    return result;
  } else {
    return [];
  }
};

export const updateOrder = async (
  pomodoros: IPomodoro[],
  loggedIn: boolean
) => {
  if (loggedIn) {
    const info = pomodoros.map((pomodoro, index) => ({
      id: pomodoro.id,
      order: index,
    }));
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000);
    try {
      const result = await fetch("/api/updateorder", {
        method: "POST",
        cache: "no-cache",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          info: info,
        }),
      }).then((data) => data.json());

      clearTimeout(id);

      return result;
    } catch (error) {
      return "";
    }
  }
};
