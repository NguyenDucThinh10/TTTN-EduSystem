/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';
import './PartBWorkspace.css';

const emptyAssignment = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: 10,
  weight: 1,
  fileUrl: '',
};

const emptyUser = {
  username: '',
  password: '',
  email: '',
  fullName: '',
  role: 'STUDENT',
};

const emptyCourse = {
  code: '',
  title: '',
  credits: 3,
};

const emptyClass = {
  courseId: '',
  teacherId: '',
  name: '',
  semester: 'Fall 2026',
  status: 'ONGOING',
};

const demoUsers = [
  { id: 1, username: 'admin', email: 'admin@edulms.com', fullName: 'System Admin', role: 'ADMIN', status: 'ACTIVE' },
  { id: 2, username: 'teacher', email: 'teacher@edulms.com', fullName: 'Teacher Demo', role: 'TEACHER', status: 'ACTIVE' },
  { id: 3, username: 'student1', email: 'student1@edulms.com', fullName: 'Student Demo', role: 'STUDENT', status: 'ACTIVE' },
];

const demoCourses = [
  { id: 1, code: 'IT101', title: 'Lap trinh Java co ban', credits: 3 },
  { id: 2, code: 'DB201', title: 'Co so du lieu', credits: 3 },
];

const demoClasses = [
  {
    id: 1,
    name: 'IT101 - Lop 1',
    semester: 'Fall 2026',
    status: 'ONGOING',
    courseTitle: 'Lap trinh Java co ban',
    teacherName: 'Teacher Demo',
  },
];

const demoAssignments = [
  {
    id: 101,
    classId: 1,
    className: 'IT101 - Lop 1',
    title: 'Bai tap OOP',
    description: 'Thiet ke class Student va tinh diem trung binh.',
    fileUrl: 'https://example.com/oop.pdf',
    dueDate: '2026-08-20T23:59:00',
    maxScore: 10,
    weight: 1,
    status: 'PUBLISHED',
    createdAt: '2026-08-10T08:00:00',
    submissionCount: 1,
  },
  {
    id: 102,
    classId: 1,
    className: 'IT101 - Lop 1',
    title: 'Mini project console',
    description: 'Xay dung ung dung quan ly sach bang Java console.',
    fileUrl: '',
    dueDate: '2026-08-28T23:59:00',
    maxScore: 10,
    weight: 1.5,
    status: 'PUBLISHED',
    createdAt: '2026-08-11T08:00:00',
    submissionCount: 0,
  },
];

const demoSubmissions = [
  {
    id: 501,
    assignmentId: 101,
    assignmentTitle: 'Bai tap OOP',
    studentId: 3,
    studentName: 'Student Demo',
    fileUrl: 'uploads/submissions/demo-oop.zip',
    submittedAt: '2026-08-12T09:30:00',
    isLate: false,
    status: 'GRADED',
    score: 8.5,
    feedback: 'Lam bai tot, can bo sung validate input.',
    gradedAt: '2026-08-13T10:00:00',
  },
];

function formatDate(value) {
  if (!value) return 'Chua dat';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toApiDate(value) {
  return value ? `${value}:00` : null;
}

function score(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '-';
}

function statusLabel(status) {
  const labels = {
    DRAFT: 'Nhap',
    PUBLISHED: 'Dang mo',
    CLOSED: 'Da dong',
    SUBMITTED: 'Da nop',
    LATE: 'Nop tre',
    GRADED: 'Da cham',
  };
  return labels[status] || status || 'Moi';
}

function fileHref(fileUrl) {
  if (!fileUrl) return '';
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  return `http://localhost:8080${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;
}

function buildAssignmentDetail(assignmentId, assignments, submissions) {
  const assignment = assignments.find((item) => String(item.id) === String(assignmentId));
  if (!assignment) return null;
  const submission = submissions.find((item) => String(item.assignmentId) === String(assignmentId));
  return {
    assignment,
    submissions: [
      {
        studentId: 3,
        studentName: 'Student Demo',
        submitted: Boolean(submission),
        submission,
      },
    ],
  };
}

function buildStudentGrades(classId, submissions) {
  const grades = submissions
    .filter((submission) => submission.status === 'GRADED')
    .map((submission) => ({
      id: submission.id,
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignmentTitle,
      studentId: submission.studentId,
      studentName: submission.studentName,
      score: submission.score,
      maxScore: 10,
      weightedScore: submission.score,
      feedback: submission.feedback,
      gradedAt: submission.gradedAt,
      gradedBy: 'Teacher Demo',
    }));
  const averageScore = grades.length
    ? grades.reduce((total, grade) => total + Number(grade.score || 0), 0) / grades.length
    : 0;
  return {
    studentId: 3,
    studentName: 'Student Demo',
    classId: Number(classId),
    className: 'IT101 - Lop 1',
    averageScore,
    grades,
  };
}

function buildClassAnalytics(assignments, submissions) {
  const graded = submissions.filter((submission) => submission.status === 'GRADED');
  const classAverage = graded.length
    ? graded.reduce((total, item) => total + Number(item.score || 0), 0) / graded.length
    : 0;
  return {
    classId: 1,
    className: 'IT101 - Lop 1',
    studentCount: 1,
    assignmentCount: assignments.length,
    classAverage,
    studentProgress: [
      {
        studentId: 3,
        studentName: 'Student Demo',
        classId: 1,
        totalAssignments: assignments.length,
        submittedAssignments: submissions.length,
        gradedAssignments: graded.length,
        completionRate: assignments.length ? (submissions.length / assignments.length) * 100 : 0,
        averageScore: classAverage,
      },
    ],
    assignmentStatistics: assignments.map((assignment) => {
      const assignmentSubmissions = submissions.filter((submission) => submission.assignmentId === assignment.id);
      const assignmentGrades = assignmentSubmissions.filter((submission) => submission.status === 'GRADED');
      const averageScore = assignmentGrades.length
        ? assignmentGrades.reduce((total, item) => total + Number(item.score || 0), 0) / assignmentGrades.length
        : 0;
      return {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        submissionCount: assignmentSubmissions.length,
        gradedCount: assignmentGrades.length,
        averageScore,
        minScore: assignmentGrades.length ? Math.min(...assignmentGrades.map((item) => Number(item.score || 0))) : 0,
        maxScore: assignmentGrades.length ? Math.max(...assignmentGrades.map((item) => Number(item.score || 0))) : 0,
      };
    }),
    scoreDistribution: [],
  };
}

export default function PartBWorkspace({ user, onLogout }) {
  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN';
  const isStudent = user.role === 'STUDENT';
  const isAdmin = user.role === 'ADMIN';
  const isDemo = Boolean(user.demo);
  const [activeModule, setActiveModule] = useState(isAdmin ? 'A' : 'B');
  const [classes, setClasses] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [assignmentDetail, setAssignmentDetail] = useState(null);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [studentGrades, setStudentGrades] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(emptyAssignment);
  const [userForm, setUserForm] = useState(emptyUser);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [classForm, setClassForm] = useState(emptyClass);
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

  const teacherOptions = useMemo(
    () => adminUsers.filter((item) => item.role === 'TEACHER'),
    [adminUsers],
  );

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
      setCourses(demoCourses);
      setAdminUsers(demoUsers);
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

  const loadAdminData = async () => {
    if (!isAdmin) return;
    if (isDemo) {
      setAdminUsers((current) => current.length ? current : demoUsers);
      setCourses((current) => current.length ? current : demoCourses);
      setClasses((current) => current.length ? current : demoClasses);
      return;
    }
    const [usersPage, courseList, classList] = await Promise.all([
      run(() => axiosClient.get('/api/admin/users?page=0&size=50')),
      run(() => axiosClient.get('/api/courses')),
      run(() => axiosClient.get('/api/admin/classes')),
    ]);
    if (usersPage) setAdminUsers(usersPage.content || usersPage);
    if (courseList) setCourses(courseList);
    if (classList) setClasses(classList);
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
      return;
    }
    const data = await run(() => axiosClient.get(`/api/assignments/${assignmentId}`));
    if (data) {
      setAssignmentDetail(data);
      const nextGradeForms = {};
      data.submissions?.forEach((row) => {
        if (row.submission) {
          nextGradeForms[row.submission.id] = {
            score: row.submission.score ?? '',
            feedback: row.submission.feedback ?? '',
          };
        }
      });
      setGradeForms(nextGradeForms);
    }
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
      setClassAnalytics(buildClassAnalytics(localAssignments, localSubmissions));
      setDashboard({
        classCount: 1,
        assignmentCount: localAssignments.length,
        submissionCount: localSubmissions.length,
        gradedSubmissionCount: localSubmissions.filter((item) => item.status === 'GRADED').length,
        averageScore: buildClassAnalytics(localAssignments, localSubmissions).classAverage,
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
    if (activeModule === 'A') {
      loadAdminData();
    }
  }, [activeModule]);

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
    setClassAnalytics(buildClassAnalytics(assignments, mySubmissions));
    setDashboard({
      classCount: 1,
      assignmentCount: assignments.length,
      submissionCount: mySubmissions.length,
      gradedSubmissionCount: mySubmissions.filter((item) => item.status === 'GRADED').length,
      averageScore: buildClassAnalytics(assignments, mySubmissions).classAverage,
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

  const handleUserFormChange = (event) => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const handleCourseFormChange = (event) => {
    const { name, value } = event.target;
    setCourseForm((current) => ({ ...current, [name]: value }));
  };

  const handleClassFormChange = (event) => {
    const { name, value } = event.target;
    setClassForm((current) => ({ ...current, [name]: value }));
  };

  const submitUserForm = async (event) => {
    event.preventDefault();
    if (isDemo) {
      const nextUser = { ...userForm, id: Date.now(), status: 'ACTIVE' };
      setAdminUsers((current) => [nextUser, ...current]);
      setUserForm(emptyUser);
      setNotice('Da tao user demo.');
      return;
    }
    await run(() => axiosClient.post('/api/admin/users', userForm), 'Da tao user.');
    setUserForm(emptyUser);
    await loadAdminData();
  };

  const submitCourseForm = async (event) => {
    event.preventDefault();
    const payload = { ...courseForm, credits: Number(courseForm.credits) };
    if (isDemo) {
      const nextCourse = { ...payload, id: Date.now() };
      setCourses((current) => [nextCourse, ...current]);
      setCourseForm(emptyCourse);
      setNotice('Da tao mon hoc demo.');
      return;
    }
    await run(() => axiosClient.post('/api/admin/courses', payload), 'Da tao mon hoc.');
    setCourseForm(emptyCourse);
    await loadAdminData();
  };

  const submitClassForm = async (event) => {
    event.preventDefault();
    const payload = {
      ...classForm,
      courseId: Number(classForm.courseId),
      teacherId: Number(classForm.teacherId),
    };
    if (isDemo) {
      const course = courses.find((item) => String(item.id) === String(payload.courseId));
      const teacher = adminUsers.find((item) => String(item.id) === String(payload.teacherId));
      const nextClass = {
        id: Date.now(),
        name: payload.name,
        semester: payload.semester,
        status: payload.status,
        courseTitle: course?.title || `Course #${payload.courseId}`,
        teacherName: teacher?.fullName || teacher?.username || `Teacher #${payload.teacherId}`,
      };
      setClasses((current) => [nextClass, ...current]);
      setClassForm(emptyClass);
      setNotice('Da tao lop hoc demo.');
      return;
    }
    await run(() => axiosClient.post('/api/admin/classes', payload), 'Da tao lop hoc.');
    setClassForm(emptyClass);
    await loadAdminData();
  };

  const toggleUserStatus = async (targetUser) => {
    const nextStatus = targetUser.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    if (isDemo) {
      setAdminUsers((current) => current.map((item) => (
        item.id === targetUser.id ? { ...item, status: nextStatus } : item
      )));
      setNotice('Da cap nhat trang thai user demo.');
      return;
    }
    await run(
      () => axiosClient.put(`/api/admin/users/${targetUser.id}/status`, { status: nextStatus }),
      'Da cap nhat trang thai user.',
    );
    await loadAdminData();
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
        setNotice('Da cap nhat bai tap demo.');
        setForm(emptyAssignment);
        setAssignmentFiles({});
        setEditingId(null);
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
        setNotice('Da tao bai tap demo.');
        setForm(emptyAssignment);
        setAssignmentFiles({});
        return;
      }
      await run(() => axiosClient.post('/api/assignments', payload), 'Da tao bai tap.');
    }
    setForm(emptyAssignment);
    setAssignmentFiles({});
    setEditingId(null);
    await loadAssignments();
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
          ? {
              ...submission,
              fileUrl: file.name,
              submittedAt: new Date().toISOString(),
              status: 'SUBMITTED',
              score: null,
              feedback: '',
              gradedAt: null,
            }
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
          ? {
              ...submission,
              score: Number(gradeForm?.score),
              feedback: gradeForm?.feedback || '',
              gradedAt,
              status: 'GRADED',
            }
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

  const submittedByAssignment = useMemo(() => {
    const map = {};
    mySubmissions.forEach((submission) => {
      map[submission.assignmentId] = submission;
    });
    return map;
  }, [mySubmissions]);

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <span className="eyebrow">EduSystem</span>
          <h1>{activeModule === 'A' ? 'Phan A Workspace' : 'Phan B Workspace'}</h1>
        </div>
        <div className="user-box">
          <div>
            <strong>{user.fullName || user.username}</strong>
            <span>{user.role}</span>
          </div>
          <button type="button" className="ghost-button" onClick={onLogout}>Dang xuat</button>
        </div>
      </header>

      {isAdmin && (
        <nav className="module-tabs" aria-label="Workspace modules">
          <button type="button" className={activeModule === 'A' ? 'active' : ''} onClick={() => setActiveModule('A')}>
            Phan A
          </button>
          <button type="button" className={activeModule === 'B' ? 'active' : ''} onClick={() => setActiveModule('B')}>
            Phan B
          </button>
        </nav>
      )}

      {activeModule === 'A' && isAdmin && (
        <>
          {notice && <div className="notice">{notice}</div>}
          {loading && <div className="loading-line">Dang tai du lieu...</div>}
          <AdminWorkspace
            adminUsers={adminUsers}
            classForm={classForm}
            classes={classes}
            courseForm={courseForm}
            courses={courses}
            handleClassFormChange={handleClassFormChange}
            handleCourseFormChange={handleCourseFormChange}
            handleUserFormChange={handleUserFormChange}
            submitClassForm={submitClassForm}
            submitCourseForm={submitCourseForm}
            submitUserForm={submitUserForm}
            teacherOptions={teacherOptions}
            toggleUserStatus={toggleUserStatus}
            userForm={userForm}
          />
        </>
      )}

      {activeModule === 'B' && (
        <>
      <section className="control-strip">
        {classes.length > 0 ? (
          <label>
            Lop hoc
            <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.semester || 'Hoc ky'}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Class ID
            <input
              type="number"
              min="1"
              placeholder="Nhap classId, vi du 1"
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
            />
          </label>
        )}
        {selectedClass && (
          <div className="class-meta">
            <strong>{selectedClass.courseTitle}</strong>
            <span>{selectedClass.teacherName} | {statusLabel(selectedClass.status)}</span>
          </div>
        )}
      </section>

      {notice && <div className="notice">{notice}</div>}
      {loading && <div className="loading-line">Dang tai du lieu...</div>}

      {isTeacher && (
        <TeacherWorkspace
          assignments={assignments}
          assignmentDetail={assignmentDetail}
          classAnalytics={classAnalytics}
          dashboard={dashboard}
          editingId={editingId}
          form={form}
          gradeForms={gradeForms}
          handleAssignmentChange={handleAssignmentChange}
          onAssignmentFileChange={(file) => setAssignmentFiles({ form: file })}
          onCancelEdit={() => {
            setEditingId(null);
            setForm(emptyAssignment);
            setAssignmentFiles({});
          }}
          onDelete={deleteAssignment}
          onGrade={gradeSubmission}
          onSelectAssignment={setSelectedAssignmentId}
          onStartEdit={startEdit}
          onSubmitAssignmentForm={submitAssignmentForm}
          selectedAssignmentId={selectedAssignmentId}
          updateGradeForm={updateGradeForm}
        />
      )}

      {isStudent && (
        <StudentWorkspace
          assignments={assignments}
          mySubmissions={mySubmissions}
          onFileChange={(assignmentId, file) => setUploadFiles((current) => ({ ...current, [assignmentId]: file }))}
          onCancelSubmission={cancelSubmission}
          onResubmit={resubmitSubmission}
          onUpload={uploadSubmission}
          selectedClass={selectedClass}
          studentGrades={studentGrades}
          submittedByAssignment={submittedByAssignment}
          uploadFiles={uploadFiles}
        />
      )}
        </>
      )}
    </main>
  );
}

function AdminWorkspace({
  adminUsers,
  classForm,
  classes,
  courseForm,
  courses,
  handleClassFormChange,
  handleCourseFormChange,
  handleUserFormChange,
  submitClassForm,
  submitCourseForm,
  submitUserForm,
  teacherOptions,
  toggleUserStatus,
  userForm,
}) {
  return (
    <div className="workspace-grid admin-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>Tao user</h2>
          <span>Admin</span>
        </div>
        <form className="assignment-form" onSubmit={submitUserForm}>
          <label>
            Username
            <input name="username" value={userForm.username} onChange={handleUserFormChange} required />
          </label>
          <label>
            Mat khau
            <input name="password" type="password" value={userForm.password} onChange={handleUserFormChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={userForm.email} onChange={handleUserFormChange} required />
          </label>
          <label>
            Ho ten
            <input name="fullName" value={userForm.fullName} onChange={handleUserFormChange} required />
          </label>
          <label>
            Role
            <select name="role" value={userForm.role} onChange={handleUserFormChange}>
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button className="primary-action" type="submit">Tao user</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Tao mon hoc</h2>
          <span>Course</span>
        </div>
        <form className="assignment-form" onSubmit={submitCourseForm}>
          <label>
            Ma mon
            <input name="code" value={courseForm.code} onChange={handleCourseFormChange} required />
          </label>
          <label>
            Ten mon
            <input name="title" value={courseForm.title} onChange={handleCourseFormChange} required />
          </label>
          <label>
            Tin chi
            <input name="credits" type="number" min="1" value={courseForm.credits} onChange={handleCourseFormChange} required />
          </label>
          <button className="primary-action" type="submit">Tao mon hoc</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Tao lop hoc</h2>
          <span>Class</span>
        </div>
        <form className="assignment-form" onSubmit={submitClassForm}>
          <label>
            Course ID
            <select name="courseId" value={classForm.courseId} onChange={handleClassFormChange} required>
              <option value="">Chon mon</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
              ))}
            </select>
          </label>
          <label>
            Teacher ID
            <select name="teacherId" value={classForm.teacherId} onChange={handleClassFormChange} required>
              <option value="">Chon giang vien</option>
              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.fullName || teacher.username}</option>
              ))}
            </select>
          </label>
          <label>
            Ten lop
            <input name="name" value={classForm.name} onChange={handleClassFormChange} required />
          </label>
          <label>
            Hoc ky
            <input name="semester" value={classForm.semester} onChange={handleClassFormChange} required />
          </label>
          <label>
            Trang thai
            <select name="status" value={classForm.status} onChange={handleClassFormChange}>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>
          <button className="primary-action" type="submit">Tao lop hoc</button>
        </form>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>Danh sach user</h2>
          <span>{adminUsers.length} user</span>
        </div>
        <div className="admin-table">
          <div className="admin-head">
            <span>Username</span>
            <span>Ho ten</span>
            <span>Role</span>
            <span>Status</span>
            <span></span>
          </div>
          {adminUsers.map((item) => (
            <div className="admin-row" key={item.id}>
              <span>{item.username}</span>
              <span>{item.fullName}</span>
              <span>{item.role}</span>
              <span className={`badge ${item.status}`}>{item.status || 'ACTIVE'}</span>
              <button type="button" onClick={() => toggleUserStatus(item)}>
                {item.status === 'BLOCKED' ? 'Mo khoa' : 'Khoa'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Mon hoc</h2>
          <span>{courses.length} mon</span>
        </div>
        <div className="compact-list">
          {courses.map((course) => (
            <article key={course.id}>
              <strong>{course.code} - {course.title}</strong>
              <span>{course.credits} tin chi</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Lop hoc</h2>
          <span>{classes.length} lop</span>
        </div>
        <div className="compact-list">
          {classes.map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.courseTitle} | {item.teacherName} | {statusLabel(item.status)}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherWorkspace(props) {
  const {
    assignments,
    assignmentDetail,
    classAnalytics,
    dashboard,
    editingId,
    form,
    gradeForms,
    handleAssignmentChange,
    onAssignmentFileChange,
    onCancelEdit,
    onDelete,
    onGrade,
    onSelectAssignment,
    onStartEdit,
    onSubmitAssignmentForm,
    selectedAssignmentId,
    updateGradeForm,
  } = props;

  return (
    <div className="workspace-grid teacher-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>{editingId ? 'Sua bai tap' : 'Tao bai tap'}</h2>
          {editingId && <button type="button" className="ghost-button" onClick={onCancelEdit}>Huy sua</button>}
        </div>
        <form className="assignment-form" onSubmit={onSubmitAssignmentForm}>
          <label>
            Tieu de
            <input name="title" value={form.title} onChange={handleAssignmentChange} required />
          </label>
          <label>
            Mo ta
            <textarea name="description" value={form.description} onChange={handleAssignmentChange} rows="4" />
          </label>
          <div className="form-row">
            <label>
              Han nop
              <input name="dueDate" type="datetime-local" value={form.dueDate} onChange={handleAssignmentChange} />
            </label>
            <label>
              Diem toi da
              <input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore} onChange={handleAssignmentChange} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Trong so
              <input name="weight" type="number" min="0.1" step="0.1" value={form.weight} onChange={handleAssignmentChange} />
            </label>
            <label>
              File/link de bai
              <input name="fileUrl" value={form.fileUrl} onChange={handleAssignmentChange} placeholder="https://..." />
            </label>
          </div>
          <label>
            Upload file de bai
            <input type="file" onChange={(event) => onAssignmentFileChange(event.target.files?.[0] || null)} />
          </label>
          <button className="primary-action" type="submit">{editingId ? 'Luu thay doi' : 'Tao bai tap'}</button>
        </form>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>Danh sach bai tap</h2>
          <span>{assignments.length} bai</span>
        </div>
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <article
              className={`assignment-item ${String(selectedAssignmentId) === String(assignment.id) ? 'selected' : ''}`}
              key={assignment.id}
            >
              <button type="button" className="assignment-main" onClick={() => onSelectAssignment(assignment.id)}>
                <strong>{assignment.title}</strong>
                <span>{formatDate(assignment.dueDate)} | {assignment.submissionCount || 0} bai nop</span>
              </button>
              <div className="assignment-actions">
                {assignment.fileUrl && (
                  <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tai de</a>
                )}
                <button type="button" onClick={() => onStartEdit(assignment)}>Sua</button>
                <button type="button" className="danger" onClick={() => onDelete(assignment.id)}>Xoa</button>
              </div>
            </article>
          ))}
          {assignments.length === 0 && <p className="empty">Lop nay chua co bai tap.</p>}
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>Bai nop va cham diem</h2>
          <span>{assignmentDetail?.assignment?.title || 'Chon bai tap'}</span>
        </div>
        <div className="submission-table">
          <div className="table-head">
            <span>Sinh vien</span>
            <span>Trang thai</span>
            <span>Diem</span>
            <span>Feedback</span>
            <span></span>
          </div>
          {assignmentDetail?.submissions?.map((row) => (
            <div className="table-row" key={row.studentId}>
              <span>{row.studentName}</span>
              <span className={`badge ${row.submission?.status || 'missing'}`}>
                {row.submitted ? statusLabel(row.submission?.status) : 'Chua nop'}
              </span>
              {row.submission ? (
                <>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={gradeForms[row.submission.id]?.score ?? ''}
                    onChange={(event) => updateGradeForm(row.submission.id, 'score', event.target.value)}
                  />
                  <input
                    value={gradeForms[row.submission.id]?.feedback ?? ''}
                    onChange={(event) => updateGradeForm(row.submission.id, 'feedback', event.target.value)}
                    placeholder="Nhan xet"
                  />
                  <div className="row-actions">
                    {row.submission.fileUrl && (
                      <a href={fileHref(row.submission.fileUrl)} target="_blank" rel="noreferrer">Tai bai</a>
                    )}
                    <button type="button" onClick={() => onGrade(row.submission.id)}>Luu diem</button>
                  </div>
                </>
              ) : (
                <>
                  <span>-</span>
                  <span>-</span>
                  <span></span>
                </>
              )}
            </div>
          ))}
          {!assignmentDetail && <p className="empty">Chon mot bai tap de xem danh sach nop bai.</p>}
        </div>
      </section>

      <AnalyticsPanel classAnalytics={classAnalytics} dashboard={dashboard} />
    </div>
  );
}

function StudentWorkspace({
  assignments,
  mySubmissions,
  onCancelSubmission,
  onFileChange,
  onResubmit,
  onUpload,
  selectedClass,
  studentGrades,
  submittedByAssignment,
  uploadFiles,
}) {
  return (
    <div className="workspace-grid student-grid">
      <section className="panel wide">
        <div className="panel-heading">
          <h2>Bai tap cua lop</h2>
          <span>{selectedClass?.name || ''}</span>
        </div>
        <div className="student-assignment-list">
          {assignments.map((assignment) => {
            const submission = submittedByAssignment[assignment.id];
            return (
              <article className="student-assignment" key={assignment.id}>
                <div>
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description || 'Khong co mo ta.'}</p>
                  <span>Han nop: {formatDate(assignment.dueDate)} | Diem: {score(assignment.maxScore)}</span>
                  {assignment.fileUrl && (
                    <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tai de bai</a>
                  )}
                </div>
                <div className="submit-box">
                  {submission ? (
                    <>
                      <span className={`badge ${submission.status}`}>{statusLabel(submission.status)}</span>
                      <strong>{submission.score != null ? `${score(submission.score)} diem` : 'Chua cham'}</strong>
                      {submission.fileUrl && (
                        <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">File da nop</a>
                      )}
                      <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                      <button type="button" onClick={() => onResubmit(assignment.id)} disabled={!uploadFiles[assignment.id]}>
                        Nop lai
                      </button>
                      <button type="button" className="danger" onClick={() => onCancelSubmission(submission.id)}>
                        Huy nop
                      </button>
                    </>
                  ) : (
                    <>
                      <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                      <button type="button" onClick={() => onUpload(assignment.id)} disabled={!uploadFiles[assignment.id]}>
                        Nop bai
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
          {assignments.length === 0 && <p className="empty">Lop nay chua co bai tap.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Bai da nop</h2>
          <span>{mySubmissions.length} bai</span>
        </div>
        <div className="compact-list">
          {mySubmissions.map((submission) => (
            <article key={submission.id}>
              <strong>{submission.assignmentTitle}</strong>
              <span>{formatDate(submission.submittedAt)} | {statusLabel(submission.status)}</span>
              {submission.fileUrl && (
                <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">Tai file</a>
              )}
            </article>
          ))}
          {mySubmissions.length === 0 && <p className="empty">Ban chua nop bai nao.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Diem cua toi</h2>
          <span>TB {score(studentGrades?.averageScore)}</span>
        </div>
        <div className="compact-list">
          {studentGrades?.grades?.map((grade) => (
            <article key={grade.id}>
              <strong>{grade.assignmentTitle}</strong>
              <span>{score(grade.score)} / {score(grade.maxScore)} | {grade.feedback || 'Chua co nhan xet'}</span>
            </article>
          ))}
          {(!studentGrades?.grades || studentGrades.grades.length === 0) && <p className="empty">Chua co diem.</p>}
        </div>
      </section>
    </div>
  );
}

function AnalyticsPanel({ classAnalytics, dashboard }) {
  return (
    <section className="panel wide">
      <div className="panel-heading">
        <h2>Thong ke</h2>
        <span>{classAnalytics?.className || 'Lop hoc'}</span>
      </div>
      <div className="metrics">
        <div><strong>{dashboard?.classCount ?? '-'}</strong><span>Lop</span></div>
        <div><strong>{dashboard?.assignmentCount ?? '-'}</strong><span>Bai tap</span></div>
        <div><strong>{dashboard?.submissionCount ?? '-'}</strong><span>Bai nop</span></div>
        <div><strong>{score(classAnalytics?.classAverage)}</strong><span>Diem TB lop</span></div>
      </div>
      <div className="analytics-columns">
        <div>
          <h3>Tien do sinh vien</h3>
          <div className="compact-list">
            {classAnalytics?.studentProgress?.map((item) => (
              <article key={item.studentId}>
                <strong>{item.studentName}</strong>
                <span>{item.submittedAssignments}/{item.totalAssignments} bai | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h3>Thong ke bai tap</h3>
          <div className="compact-list">
            {classAnalytics?.assignmentStatistics?.map((item) => (
              <article key={item.assignmentId}>
                <strong>{item.assignmentTitle}</strong>
                <span>{item.submissionCount} nop | {item.gradedCount} cham | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
