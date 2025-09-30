import { useFetcher, type SubmitOptions } from 'react-router';
import { useCallback, useEffect, useRef } from 'react';

interface DebouncedSubmitFunction {
  (formData: FormData, options: SubmitOptions & { debounceTimeout?: number }): void;
}

export function useDebounceFetcher<T = any>() {
  const fetcher = useFetcher<T>();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const submit: DebouncedSubmitFunction = useCallback(
    (formData, options) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const { debounceTimeout, ...submitOptions } = options;
      const delay = debounceTimeout ?? 200;

      timeoutRef.current = setTimeout(() => {
        fetcher.submit(formData, submitOptions);
      }, delay);
    },
    [fetcher],
  );

  return { ...fetcher, submit };
}
