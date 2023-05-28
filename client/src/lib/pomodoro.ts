import { IPomodoro } from "../../types";

const authorizedFetch = async <Type>(url: RequestInfo, init?: RequestInit) => {
  const result = await fetch(url, init);
  if (result.status == 205) return await fetch(url, init);
  return result;
};

export const addPomodoro = async (pomodoro: IPomodoro): Promise<IPomodoro> => {
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
};

export const savePomodoro = async (pomodoro: IPomodoro, order: number) => {
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
};

export const deletePomodoro = async (id: string) => {
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
};

export const getPomodoros = async () => {
  const result = await authorizedFetch("/api/get").then((response) =>
    response.json()
  );

  return result;
};

export const updateOrder = async (pomodoros: IPomodoro[]) => {
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
};
