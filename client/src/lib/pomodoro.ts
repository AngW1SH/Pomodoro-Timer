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
