import { useCallback, useState } from "react";
export const useApi = (request) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (...args) => {
    setLoading(true); setError(null);
    try { const result = await request(...args); setData(result); return result; }
    catch (err) { setError(err); throw err; }
    finally { setLoading(false); }
  }, [request]);
  return { data, error, loading, execute };
};
