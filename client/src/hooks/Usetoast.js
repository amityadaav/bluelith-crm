import { useState, useCallback } from "react";

export function useToast(duration = 3500) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), duration);
  }, [duration]);

  const clearToast = useCallback(() => setToast(null), []);

  return { toast, showToast, clearToast };
}