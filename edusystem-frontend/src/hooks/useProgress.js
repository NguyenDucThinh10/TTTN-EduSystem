/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useProgress(classId) {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!classId) return null;
    setLoading(true);
    setError('');
    try {
      const [classData, dashboardData] = await Promise.all([
        analyticsService.classAnalytics(classId),
        analyticsService.dashboard(),
      ]);
      setAnalytics(classData);
      setDashboard(dashboardData);
      return { analytics: classData, dashboard: dashboardData };
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Khong tai duoc thong ke.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { analytics, dashboard, loading, error, refresh };
}
