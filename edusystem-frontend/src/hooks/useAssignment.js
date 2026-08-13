/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { assignmentService } from '../services/assignmentService';

export function useAssignment(classId) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!classId) {
      setAssignments([]);
      return [];
    }
    setLoading(true);
    setError('');
    try {
      const data = await assignmentService.listByClass(classId);
      setAssignments(data || []);
      return data || [];
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Khong tai duoc bai tap.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { assignments, setAssignments, loading, error, refresh };
}
