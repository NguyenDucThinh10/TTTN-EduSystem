/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { submissionService } from '../services/submissionService';

export function useSubmission({ assignmentId, classId, mine = false } = {}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = mine
        ? await submissionService.mySubmissions(classId)
        : assignmentId
          ? await submissionService.listByAssignment(assignmentId)
          : [];
      setSubmissions(data || []);
      return data || [];
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Khong tai duoc bai nop.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [assignmentId, classId, mine]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { submissions, setSubmissions, loading, error, refresh };
}
