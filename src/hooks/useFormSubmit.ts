import { useCallback, useState } from 'react';
import { content } from '../config/content';
import { getErrorMessage } from '../services/api/api-error';

interface SubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const idleState: SubmitState = { isSubmitting: false, isSuccess: false, error: null };

export const useFormSubmit = () => {
  const [state, setState] = useState<SubmitState>(idleState);

  const submit = useCallback(async (action: () => Promise<unknown>) => {
    setState({ isSubmitting: true, isSuccess: false, error: null });
    try {
      await action();
      setState({ isSubmitting: false, isSuccess: true, error: null });
    } catch (error) {
      setState({ isSubmitting: false, isSuccess: false, error: getErrorMessage(error, content.common.saveError) });
    }
  }, []);

  const reset = useCallback(() => setState(idleState), []);

  return { ...state, submit, reset };
};
