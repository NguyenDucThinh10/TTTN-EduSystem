/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toApiDate } from './learningHelpers';

const emptyAssignment = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: 10,
  weight: 1,
  fileUrl: '',
};

export default function useLearningWorkflow(user) {
  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN';
  const isStudent = user.role === 'STUDENT';
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [assignmentDetail, setAssignmentDetail] = useState(null);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [studentGrades, setStudentGrades] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(emptyAssignment);
  const [editingId, setEditingId] = useState(null);
  const [uploadFiles, setUploadFiles] = useState({});
  const [assignmentFiles, setAssignmentFiles] = useState({});
  const [gradeForms, setGradeForms] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const selectedClass = useMemo(
    () => classes.find((item) => String(item.id) === String(selectedClassId)),
    [classes, selectedClassId],
  );

  const submittedByAssignment = useMemo(() => {
    const map = {};
    mySubmissions.forEach((submission) => {
      map[submission.assignmentId] = submission;
    });
    return map;
  }, [mySubmissions]);

  async function run(action, successMessage) {
    setLoading(true);
    setNotice('');
    try {
      const result = await action();
      if (successMessage) setNotice(successMessage);
      return result;
    } catch (error) {
      const data = error.response?.data;
      setNotice(data?.message || data || 'Thao tac that bai.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const loadClasses = async () => {
    const data = await run(() => axiosClient.get('/api/classes/me'));
    if (!data) return;
    setClasses(data);
    setSelectedClassId((current) => current || data[0]?.id || '');
  };

  const loadAssignments = async (classId = selectedClassId) => {
    if (!classId) {
      setAssignments([]);
      return;
    }
    const data = await run(() => axiosClient.get(`/api/assignments/class/${classId}`));
    if (data) {
      setAssignments(data);
      setSelectedAssignmentId((current) => current || data[0]?.id || '');
    }
  };

  const loadAssignmentDetail = async (assignmentId = selectedAssignmentId) => {
    if (!assignmentId || !isTeacher) {
      setAssignmentDetail(null);
      return;
    }
    const data = await run(() => axiosClient.get(`/api/assignments/${assignmentId}`));
    if (data) {
      setAssignmentDetail(data);
      seedGradeForms(data);
    }
  };

  const seedGradeForms = (detail) => {
    const nextGradeForms = {};
    detail?.submissions?.forEach((row) => {
      if (row.submission) {
        nextGradeForms[row.submission.id] = {
          score: row.submission.score ?? '',
          feedback: row.submission.feedback ?? '',
        };
      }
    });
    setGradeForms(nextGradeForms);
  };

  const loadStudentData = async (classId = selectedClassId) => {
    if (!isStudent) return;
    const submissions = await run(() => axiosClient.get('/api/submissions/me'));
    if (submissions) setMySubmissions(submissions);

    const studentId = user.id || submissions?.[0]?.studentId;
    if (classId && studentId) {
      const grades = await run(() => axiosClient.get(`/api/grades/students/${studentId}/classes/${classId}`));
      if (grades) setStudentGrades(grades);
    }
  };

  const loadAnalytics = async (classId = selectedClassId) => {
    if (!classId || !isTeacher) return;
    const [classData, dashboardData] = await Promise.all([
      run(() => axiosClient.get(`/api/analytics/classes/${classId}`)),
      run(() => axiosClient.get('/api/analytics/dashboard')),
    ]);
    if (classData) setClassAnalytics(classData);
    if (dashboardData) setDashboard(dashboardData);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    loadAssignments(selectedClassId);
    loadAnalytics(selectedClassId);
    loadStudentData(selectedClassId);
  }, [selectedClassId]);

  useEffect(() => {
    loadAssignmentDetail(selectedAssignmentId);
  }, [selectedAssignmentId]);

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitAssignmentForm = async (event) => {
    event.preventDefault();
    let uploadedFileUrl = form.fileUrl;
    const selectedFile = assignmentFiles.form;
    if (selectedFile) {
      const fileData = new FormData();
      fileData.append('file', selectedFile);
      const uploadResult = await run(() => axiosClient.post('/api/files/assignments', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }));
      if (!uploadResult?.fileUrl) return;
      uploadedFileUrl = uploadResult.fileUrl;
    }

    const payload = {
      classId: Number(selectedClassId),
      title: form.title,
      description: form.description,
      fileUrl: uploadedFileUrl,
      dueDate: toApiDate(form.dueDate),
      maxScore: Number(form.maxScore),
      weight: Number(form.weight),
    };

    if (editingId) {
      await run(() => axiosClient.put(`/api/assignments/${editingId}`, payload), 'Da cap nhat bai tap.');
    } else {
      await run(() => axiosClient.post('/api/assignments', payload), 'Da tao bai tap.');
    }
    resetAssignmentForm();
    await loadAssignments();
  };

  const resetAssignmentForm = (message) => {
    if (message) setNotice(message);
    setForm(emptyAssignment);
    setAssignmentFiles({});
    setEditingId(null);
  };

  const startEdit = (assignment) => {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 16) : '',
      maxScore: assignment.maxScore || 10,
      weight: assignment.weight || 1,
      fileUrl: assignment.fileUrl || '',
    });
  };

  const deleteAssignment = async (assignmentId) => {
    await run(() => axiosClient.delete(`/api/assignments/${assignmentId}`), 'Da xoa bai tap.');
    if (String(selectedAssignmentId) === String(assignmentId)) {
      setSelectedAssignmentId('');
      setAssignmentDetail(null);
    }
    await loadAssignments();
  };

  const uploadSubmission = async (assignmentId) => {
    const file = uploadFiles[assignmentId];
    if (!file) {
      setNotice('Chon file truoc khi nop bai.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await run(
      () => axiosClient.post(`/api/submissions/assignments/${assignmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      'Da nop bai thanh cong.',
    );
    setUploadFiles((current) => ({ ...current, [assignmentId]: null }));
    await loadStudentData();
    await loadAssignments();
  };

  const resubmitSubmission = async (assignmentId) => {
    const file = uploadFiles[assignmentId];
    if (!file) {
      setNotice('Chon file moi truoc khi nop lai.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await run(
      () => axiosClient.put(`/api/submissions/assignments/${assignmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      'Da nop lai bai thanh cong.',
    );
    setUploadFiles((current) => ({ ...current, [assignmentId]: null }));
    await loadStudentData();
    await loadAssignments();
  };

  const cancelSubmission = async (submissionId) => {
    await run(() => axiosClient.delete(`/api/submissions/${submissionId}`), 'Da huy bai nop.');
    await loadStudentData();
    await loadAssignments();
  };

  const updateGradeForm = (submissionId, field, value) => {
    setGradeForms((current) => ({
      ...current,
      [submissionId]: {
        score: current[submissionId]?.score ?? '',
        feedback: current[submissionId]?.feedback ?? '',
        [field]: value,
      },
    }));
  };

  const gradeSubmission = async (submissionId) => {
    const gradeForm = gradeForms[submissionId];
    await run(
      () => axiosClient.put(`/api/grades/submissions/${submissionId}`, {
        score: Number(gradeForm?.score),
        feedback: gradeForm?.feedback || '',
      }),
      'Da luu diem.',
    );
    await loadAssignmentDetail();
    await loadAnalytics();
  };

  return {
    assignments,
    assignmentDetail,
    classAnalytics,
    classes,
    dashboard,
    editingId,
    form,
    gradeForms,
    handleAssignmentChange,
    isStudent,
    isTeacher,
    loading,
    mySubmissions,
    notice,
    onAssignmentFileChange: (file) => setAssignmentFiles({ form: file }),
    onCancelEdit: () => resetAssignmentForm(),
    onCancelSubmission: cancelSubmission,
    onDeleteAssignment: deleteAssignment,
    onFileChange: (assignmentId, file) => setUploadFiles((current) => ({ ...current, [assignmentId]: file })),
    onGrade: gradeSubmission,
    onResubmit: resubmitSubmission,
    onSelectAssignment: setSelectedAssignmentId,
    onStartEdit: startEdit,
    onSubmitAssignmentForm: submitAssignmentForm,
    onUpload: uploadSubmission,
    selectedAssignmentId,
    selectedClass,
    selectedClassId,
    setSelectedClassId,
    studentGrades,
    submittedByAssignment,
    updateGradeForm,
    uploadFiles,
  };
}
