/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { emptyAssignment, demoAssignments, demoClasses, demoSubmissions } from './learningData';
import {
  buildAssignmentDetail,
  buildClassAnalytics,
  buildStudentGrades,
  toApiDate,
} from './learningHelpers';

export default function useLearningWorkflow(user) {
  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN';
  const isStudent = user.role === 'STUDENT';
  const isDemo = Boolean(user.demo);
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
    if (isDemo) {
      setClasses(demoClasses);
      setAssignments(demoAssignments);
      setMySubmissions(demoSubmissions);
      setSelectedClassId((current) => current || demoClasses[0].id);
      setSelectedAssignmentId((current) => current || demoAssignments[0].id);
      return;
    }
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
    if (isDemo) {
      setAssignments((current) => {
        const list = current.length ? current : demoAssignments;
        setSelectedAssignmentId((selected) => selected || list[0]?.id || '');
        return list;
      });
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
    if (isDemo) {
      const detail = buildAssignmentDetail(assignmentId, assignments.length ? assignments : demoAssignments, mySubmissions.length ? mySubmissions : demoSubmissions);
      setAssignmentDetail(detail);
      seedGradeForms(detail);
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
    if (isDemo) {
      setMySubmissions((current) => {
        const list = current.length ? current : demoSubmissions;
        setStudentGrades(buildStudentGrades(classId, list));
        return list;
      });
      return;
    }
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
    if (isDemo) {
      const localAssignments = assignments.length ? assignments : demoAssignments;
      const localSubmissions = mySubmissions.length ? mySubmissions : demoSubmissions;
      const analytics = buildClassAnalytics(localAssignments, localSubmissions);
      setClassAnalytics(analytics);
      setDashboard({
        classCount: 1,
        assignmentCount: localAssignments.length,
        submissionCount: localSubmissions.length,
        gradedSubmissionCount: localSubmissions.filter((item) => item.status === 'GRADED').length,
        averageScore: analytics.classAverage,
      });
      return;
    }
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

  useEffect(() => {
    if (!isDemo || !selectedClassId) return;
    const analytics = buildClassAnalytics(assignments, mySubmissions);
    setClassAnalytics(analytics);
    setDashboard({
      classCount: 1,
      assignmentCount: assignments.length,
      submissionCount: mySubmissions.length,
      gradedSubmissionCount: mySubmissions.filter((item) => item.status === 'GRADED').length,
      averageScore: analytics.classAverage,
    });
    if (selectedAssignmentId && isTeacher) {
      setAssignmentDetail(buildAssignmentDetail(selectedAssignmentId, assignments, mySubmissions));
    }
    if (isStudent) {
      setStudentGrades(buildStudentGrades(selectedClassId, mySubmissions));
    }
  }, [assignments, mySubmissions, selectedClassId, selectedAssignmentId]);

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitAssignmentForm = async (event) => {
    event.preventDefault();
    let uploadedFileUrl = form.fileUrl;
    const selectedFile = assignmentFiles.form;
    if (selectedFile && !isDemo) {
      const fileData = new FormData();
      fileData.append('file', selectedFile);
      const uploadResult = await run(() => axiosClient.post('/api/files/assignments', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }));
      if (!uploadResult?.fileUrl) return;
      uploadedFileUrl = uploadResult.fileUrl;
    } else if (selectedFile && isDemo) {
      uploadedFileUrl = selectedFile.name;
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
      if (isDemo) {
        setAssignments((current) => current.map((assignment) => (
          assignment.id === editingId ? { ...assignment, ...payload, id: editingId, status: assignment.status } : assignment
        )));
        resetAssignmentForm('Da cap nhat bai tap demo.');
        return;
      }
      await run(() => axiosClient.put(`/api/assignments/${editingId}`, payload), 'Da cap nhat bai tap.');
    } else {
      if (isDemo) {
        const nextAssignment = {
          ...payload,
          id: Date.now(),
          className: selectedClass?.name || 'Lop demo',
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          submissionCount: 0,
        };
        setAssignments((current) => [nextAssignment, ...current]);
        setSelectedAssignmentId(nextAssignment.id);
        resetAssignmentForm('Da tao bai tap demo.');
        return;
      }
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
    if (isDemo) {
      setAssignments((current) => current.filter((assignment) => assignment.id !== assignmentId));
      setMySubmissions((current) => current.filter((submission) => submission.assignmentId !== assignmentId));
      if (String(selectedAssignmentId) === String(assignmentId)) {
        setSelectedAssignmentId('');
        setAssignmentDetail(null);
      }
      setNotice('Da xoa bai tap demo.');
      return;
    }
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
    if (isDemo) {
      const assignment = assignments.find((item) => item.id === assignmentId);
      const nextSubmission = {
        id: Date.now(),
        assignmentId,
        assignmentTitle: assignment?.title || 'Bai tap demo',
        studentId: user.id,
        studentName: user.fullName || user.username,
        fileUrl: file.name,
        submittedAt: new Date().toISOString(),
        isLate: false,
        status: 'SUBMITTED',
        score: null,
        feedback: '',
        gradedAt: null,
      };
      setMySubmissions((current) => [nextSubmission, ...current]);
      setAssignments((current) => current.map((item) => (
        item.id === assignmentId ? { ...item, submissionCount: Number(item.submissionCount || 0) + 1 } : item
      )));
      setUploadFiles((current) => ({ ...current, [assignmentId]: null }));
      setStudentGrades(buildStudentGrades(selectedClassId, [nextSubmission, ...mySubmissions]));
      setNotice('Da nop bai demo.');
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
    if (isDemo) {
      const updated = mySubmissions.map((submission) => (
        submission.assignmentId === assignmentId
          ? { ...submission, fileUrl: file.name, submittedAt: new Date().toISOString(), status: 'SUBMITTED', score: null, feedback: '', gradedAt: null }
          : submission
      ));
      setMySubmissions(updated);
      setStudentGrades(buildStudentGrades(selectedClassId, updated));
      setUploadFiles((current) => ({ ...current, [assignmentId]: null }));
      setNotice('Da nop lai bai demo.');
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
    if (isDemo) {
      const submission = mySubmissions.find((item) => item.id === submissionId);
      const updated = mySubmissions.filter((item) => item.id !== submissionId);
      setMySubmissions(updated);
      if (submission) {
        setAssignments((current) => current.map((item) => (
          item.id === submission.assignmentId
            ? { ...item, submissionCount: Math.max(0, Number(item.submissionCount || 0) - 1) }
            : item
        )));
      }
      setStudentGrades(buildStudentGrades(selectedClassId, updated));
      setNotice('Da huy bai nop demo.');
      return;
    }
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
    if (isDemo) {
      const gradedAt = new Date().toISOString();
      const updatedSubmissions = (mySubmissions.length ? mySubmissions : demoSubmissions).map((submission) => (
        submission.id === submissionId
          ? { ...submission, score: Number(gradeForm?.score), feedback: gradeForm?.feedback || '', gradedAt, status: 'GRADED' }
          : submission
      ));
      setMySubmissions(updatedSubmissions);
      setAssignmentDetail(buildAssignmentDetail(selectedAssignmentId, assignments, updatedSubmissions));
      setClassAnalytics(buildClassAnalytics(assignments, updatedSubmissions));
      setStudentGrades(buildStudentGrades(selectedClassId, updatedSubmissions));
      setNotice('Da luu diem demo.');
      return;
    }
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
