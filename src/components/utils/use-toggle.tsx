import { useCallback, useState } from "react"

const useToggle = (initialState = false) => {
  const [status, setStatus] = useState(initialState);

  const toggleStatus = useCallback(() => setStatus((prev) => !prev), []);
  return [status, toggleStatus, setStatus] as const;
};

export default useToggle;