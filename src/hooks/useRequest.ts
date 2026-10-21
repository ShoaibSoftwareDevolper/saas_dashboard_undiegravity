import { useCallback, useEffect, useState } from 'react';
import { content } from '../config/content';
import { getErrorMessage } from '../services/api/api-error';

interface RequestState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export const useRequest = <T>(fetcher: () => Promise<T>) => {
  const [state, setState] = useState<RequestState<T>>({ data: null, error: null, isLoading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetcher()
      .then((data) => {
        if (active) setState({ data, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (active) setState({ data: null, error: getErrorMessage(error, content.common.error), isLoading: false });
      });
    return () => {
      active = false;
    };
  }, [fetcher, attempt]);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, error: null, isLoading: true }));
    setAttempt((value) => value + 1);
  }, []);

  const mutate = useCallback((updater: (current: T | null) => T) => {
    setState((current) => ({ ...current, data: updater(current.data) }));
  }, []);

  return { ...state, retry, mutate };
};
