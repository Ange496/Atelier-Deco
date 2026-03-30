import { useState, useCallback } from 'react';

export function useToast(duration = 2800) {
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  }, [duration]);

  return { toastMessage, showToast };
}