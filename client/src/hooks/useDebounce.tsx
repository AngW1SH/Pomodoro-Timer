import { useEffect, useState } from "react";
import { IPomodoro } from "../../types";

export const useDebounce = (value: IPomodoro | null, time: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value) setDebounceValue({ ...value });
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return debounceValue;
};
