import { useState } from "react";

type UseToggleReturn = {
  value: boolean;
  toggle: () => void;
  setValue: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
};

export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((prev) => !prev);
  }

  function setTrue() {
    setValue(true);
  }

  function setFalse() {
    setValue(false);
  }

  return {
    value,
    toggle,
    setValue,
    setTrue,
    setFalse,
  };
}
