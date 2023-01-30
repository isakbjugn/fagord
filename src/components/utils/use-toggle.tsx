import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';

const useToggle = (
  initialState = false
): readonly [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [status, setStatus] = useState(initialState);

  const toggleStatus = useCallback(() => {
    setStatus((prev) => !prev);
  }, []);
  return [status, toggleStatus, setStatus] as const;
};

export default useToggle;
