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

export default function PartBWorkspace({ user, onLogout }) {
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
  const [gradeForms, setGradeForms] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const selectedClass = useMemo(
    () => classes.find((item) => String(item.id) === String(selectedClassId)),
    [classes, selectedClassId],
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
    const submissions = await run(() => axiosClient.get('/api/submissions/me'));
    if (submissions) setMySubmissions(submissions);

    if (classId && user.id) {
      const grades = await run(() => axiosClient.get(`/api/grades/students/${user.id}/classes/${classId}`));
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
    const payload = {
      classId: Number(selectedClassId),
      title: form.title,
      description: form.description,
      fileUrl: form.fileUrl,
      dueDate: toApiDate(form.dueDate),
      maxScore: Number(form.maxScore),
      weight: Number(form.weight),
    };

    if (editingId) {
      await run(() => axiosClient.put(`/api/assignments/${editingId}`, payload), 'Da cap nhat bai tap.');
    } else {
      await run(() => axiosClient.post('/api/assignments', payload), 'Da tao bai tap.');
    }
    setForm(emptyAssignment);
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
          <h1>Phan B Workspace</h1>
        </div>
        <div className="user-box">
          <div>
            <strong>{user.fullName || user.username}</strong>
            <span>{user.role}</span>
          </div>
          <button type="button" className="ghost-button" onClick={onLogout}>Dang xuat</button>
        </div>
      </header>

      <section className="control-strip">
        <label>
          Lop hoc
          <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
            {classes.length === 0 && <option value="">Chua co lop</option>}
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.semester || 'Hoc ky'}
              </option>
            ))}
          </select>
        </label>
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
          onCancelEdit={() => {
            setEditingId(null);
            setForm(emptyAssignment);
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
          onUpload={uploadSubmission}
          selectedClass={selectedClass}
          studentGrades={studentGrades}
          submittedByAssignment={submittedByAssignment}
          uploadFiles={uploadFiles}
        />
      )}
    </main>
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
                  <button type="button" onClick={() => onGrade(row.submission.id)}>Luu diem</button>
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

function StudentWorkspace({ assignments, mySubmissions, onFileChange, onUpload, selectedClass, studentGrades, submittedByAssignment, uploadFiles }) {
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
                </div>
                <div className="submit-box">
                  {submission ? (
                    <>
                      <span className={`badge ${submission.status}`}>{statusLabel(submission.status)}</span>
                      <strong>{submission.score != null ? `${score(submission.score)} diem` : 'Chua cham'}</strong>
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
