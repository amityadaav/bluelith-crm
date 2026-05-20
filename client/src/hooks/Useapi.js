import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi("/leads");
 */
export function useApi(url, options = {}) {
  const { immediate = true, initialData = null } = options;

  const [data,    setData]    = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (overrideUrl) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(overrideUrl || url);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) fetch();
  }, [fetch, immediate]);

  return { data, loading, error, refetch: fetch };
}