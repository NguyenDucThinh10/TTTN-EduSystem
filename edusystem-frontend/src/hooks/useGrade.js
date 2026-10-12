/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { gradeService } from '../services/gradeService';

export function useGrade(studentId, classId) {
  const [gradebook, setGradebook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!studentId || !classId) return null;
    setLoading(true);
    setError('');
    try {
      const data = await gradeService.byStudentClass(studentId, classId);
      setGradebook(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Khong tai duoc diem.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [studentId, classId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { gradebook, setGradebook, loading, error, refresh };
}
