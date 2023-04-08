import { IPomodoro } from "../../types";

export const addPomodoro = async (pomodoro: IPomodoro) => {
  const result = await fetch("/api/add", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pomodoro: pomodoro,
    }),
  }).then((data) => data.json());

  return result;
};

export const savePomodoro = async (pomodoro: IPomodoro, order: number) => {
  const result = await fetch("/api/save", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pomodoro: { ...pomodoro, order: order },
    }),
  }).then((data) => data.json());

  return result;
};

export const deletePomodoro = async (id: number) => {
  const result = await fetch("/api/delete", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  }).then((data) => data.json());

  return result;
};

export const getPomodoros = async () => {
  const result = await fetch("/api/get").then((data) => data.json());

  return result;
};

export const updateOrder = async (pomodoros: IPomodoro[]) => {
  const info = pomodoros.map((pomodoro, index) => ({
    id: pomodoro.id,
    order: index,
  }));

  const result = await fetch("/api/updateorder", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: info,
    }),
  }).then((data) => data.json());

  return result;
};
