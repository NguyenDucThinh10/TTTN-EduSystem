import { useMemo } from 'react';
import { useState } from 'react';
import {
  BarChartOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  PieChartOutlined,
  RiseOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const colors = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const numberValue = (value) => Number(value) || 0;
const percent = (part, total) => (numberValue(total) ? (numberValue(part) / numberValue(total)) * 100 : 0);
const clampPercent = (value) => Math.max(0, Math.min(100, numberValue(value)));
const scoreText = (value) => Number(numberValue(value)).toFixed(2);

function StatCard({ icon, label, value, hint, color }) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-icon" style={{ color, background: `${color}18` }}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value ?? 0}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </article>
  );
}

function RingChart({ value, label, caption, color = '#2563eb' }) {
  const safeValue = clampPercent(value);
  return (
    <div className="dashboard-ring-wrap">
      <div className="dashboard-ring" style={{ '--ring-value': `${safeValue}%`, '--ring-color': color }}>
        <div><strong>{Math.round(safeValue)}%</strong><span>{label}</span></div>
      </div>
      <div className="dashboard-chart-caption"><strong>{caption}</strong><span>Dữ liệu hiện tại</span></div>
    </div>
  );
}

function DonutChart({ items, centerLabel = 'Tổng' }) {
  const total = items.reduce((sum, item) => sum + numberValue(item.value), 0);
  let offset = 0;
  const gradient = total
    ? items.map((item, index) => {
      const start = offset;
      offset += (numberValue(item.value) / total) * 100;
      return `${item.color || colors[index % colors.length]} ${start}% ${offset}%`;
    }).join(', ')
    : '#e2e8f0 0 100%';

  return (
    <div className="dashboard-donut-wrap">
      <div className="dashboard-donut" style={{ '--donut-gradient': gradient }}>
        <div><strong>{total}</strong><span>{centerLabel}</span></div>
      </div>
      <div className="dashboard-donut-legend">
        {items.map((item, index) => (
          <span key={item.label}>
            <i style={{ background: item.color || colors[index % colors.length] }} />
            {item.label}: <strong>{item.value ?? 0}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ items }) {
  const max = Math.max(...items.map((item) => numberValue(item.value)), 1);
  return (
    <div className="dashboard-bars">
      {items.map((item, index) => (
        <div className="dashboard-bar-item" key={item.label}>
          <div className="dashboard-bar-track"><i style={{ height: `${(numberValue(item.value) / max) * 100}%`, background: item.color || colors[index % colors.length] }} /></div>
          <strong>{item.value ?? 0}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressList({ items, valueKey = 'value', labelKey = 'label', emptyText = 'Chưa có dữ liệu.' }) {
  if (!items.length) return <p className="dashboard-empty">{emptyText}</p>;
  return (
    <div className="dashboard-progress-list">
      {items.slice(0, 6).map((item, index) => {
        const value = clampPercent(item[valueKey]);
        return (
          <div className="dashboard-progress-row" key={`${item[labelKey]}-${index}`}>
            <div><strong>{item[labelKey]}</strong><span>{Math.round(value)}%</span></div>
            <div className="dashboard-progress-track"><i style={{ width: `${value}%`, background: colors[index % colors.length] }} /></div>
          </div>
        );
      })}
    </div>
  );
}

function Panel({ title, icon, children, className = '' }) {
  return <section className={`dashboard-chart-panel ${className}`}><div className="dashboard-panel-title">{icon}<h3>{title}</h3></div>{children}</section>;
}

export function AdminDashboardOverview({ dashboard }) {
  const stats = useMemo(() => [
    { icon: <UserOutlined />, label: 'Tổng tài khoản', value: dashboard?.totalUsers, hint: `${dashboard?.totalAdmins ?? 0} quản trị viên`, color: '#2563eb' },
    { icon: <TeamOutlined />, label: 'Sinh viên', value: dashboard?.totalStudents, color: '#14b8a6' },
    { icon: <UserOutlined />, label: 'Giảng viên', value: dashboard?.totalTeachers, color: '#f97316' },
    { icon: <BookOutlined />, label: 'Lớp học', value: dashboard?.totalClasses, hint: `${dashboard?.totalSubjects ?? 0} học phần`, color: '#f59e0b' },
  ], [dashboard]);

  return (
    <DashboardShell title="Tổng quan hệ thống" subtitle="Số liệu được tổng hợp trực tiếp từ cơ sở dữ liệu EduSystem." stats={stats}>
      <div className="dashboard-chart-grid">
        <Panel title="Quy mô hệ thống" icon={<TeamOutlined />}><BarChart items={[
          { label: 'Sinh viên', value: dashboard?.totalStudents },
          { label: 'Giảng viên', value: dashboard?.totalTeachers },
          { label: 'Học phần', value: dashboard?.totalSubjects },
          { label: 'Lớp học', value: dashboard?.totalClasses },
        ]} /></Panel>
        <Panel title="Cơ cấu tài khoản" icon={<PieChartOutlined />}><DonutChart centerLabel="người dùng" items={[
          { label: 'Admin', value: dashboard?.totalAdmins, color: '#2563eb' },
          { label: 'Giảng viên', value: dashboard?.totalTeachers, color: '#f59e0b' },
          { label: 'Sinh viên', value: dashboard?.totalStudents, color: '#14b8a6' },
        ]} /></Panel>
      </div>
    </DashboardShell>
  );
}

export function TeacherDashboardOverview({ workflow, hideHeading = false }) {
  const analytics = workflow?.classAnalytics;
  const dashboard = workflow?.dashboard;
  const submissions = workflow?.assignmentDetail?.submissions || [];
  const pending = submissions.filter((row) => row.submission && row.submission.status !== 'GRADED').length;
  const distribution = analytics?.scoreDistribution || [];
  const progress = analytics?.studentProgress || [];
  const assignmentStats = analytics?.assignmentStatistics || [];
  const gradedCount = assignmentStats.reduce((sum, item) => sum + numberValue(item.gradedCount), 0) || dashboard?.gradedSubmissionCount;
  const submissionCount = assignmentStats.reduce((sum, item) => sum + numberValue(item.submissionCount), 0) || dashboard?.submissionCount;

  const stats = [
    { icon: <BookOutlined />, label: 'Lớp phụ trách', value: workflow?.classes?.length, color: '#2563eb' },
    { icon: <TeamOutlined />, label: 'Sinh viên lớp chọn', value: analytics?.studentCount || workflow?.classStudents?.length, color: '#14b8a6' },
    { icon: <FileDoneOutlined />, label: 'Bài tập lớp chọn', value: analytics?.assignmentCount || workflow?.assignments?.length, color: '#f59e0b' },
    { icon: <CheckCircleOutlined />, label: 'Bài chưa chấm', value: pending, color: '#ef4444' },
  ];

  return (
    <DashboardShell title="Tổng quan giảng viên" subtitle={workflow?.selectedClass?.name ? `Đang xem dữ liệu của ${workflow.selectedClass.name}.` : 'Chọn một lớp để xem thống kê chi tiết.'} stats={stats} hideHeading={hideHeading}>
      <div className="dashboard-chart-grid">
        <Panel title="Kết quả học tập" icon={<BarChartOutlined />}><BarChart items={distribution.length ? distribution.map((item, index) => ({ label: item.label || item.range || 'Mức điểm', value: item.count, color: colors[index % colors.length] })) : [{ label: 'Chưa có điểm', value: 0 }]} /></Panel>
        <Panel title="Điểm trung bình lớp" icon={<CheckCircleOutlined />}><RingChart value={numberValue(analytics?.classAverage) * 10} label="/ 10 điểm" caption={`${scoreText(analytics?.classAverage)} điểm trung bình`} color="#2563eb" /></Panel>
        <Panel title="Tiến độ từng sinh viên" icon={<RiseOutlined />}><ProgressList items={progress.map((item) => ({ label: item.studentName || `SV ${item.studentId}`, value: item.completionRate }))} emptyText="Chưa có sinh viên hoặc bài tập." /></Panel>
        <Panel title="Tổng quan nộp/chấm" icon={<PieChartOutlined />}><DonutChart centerLabel="bài" items={[
          { label: 'Đã chấm', value: gradedCount, color: '#14b8a6' },
          { label: 'Chưa chấm', value: Math.max(numberValue(submissionCount) - numberValue(gradedCount), 0), color: '#ef4444' },
          { label: 'Bài tập', value: analytics?.assignmentCount || workflow?.assignments?.length, color: '#f59e0b' },
        ]} /></Panel>
      </div>
    </DashboardShell>
  );
}

export function StudentDashboardOverview({ workflow, hideHeading = false }) {
  const [semester, setSemester] = useState('');
  const submitted = workflow?.mySubmissions?.length || 0;
  const graded = workflow?.studentGrades?.grades?.length || 0;
  const grades = workflow?.studentGrades?.grades || [];
  const classes = workflow?.classes || [];
  const semesters = [...new Set(classes.map((item) => item.semester).filter(Boolean))];
  const selectedSemester = semesters.includes(semester) ? semester : semesters[0];
  const semesterClasses = selectedSemester ? classes.filter((item) => item.semester === selectedSemester) : classes;
  const scoresByClass = new Map();
  grades.forEach((grade) => {
    const classScores = scoresByClass.get(grade.classId) || { regular: [], midterm: [], final: [] };
    const title = grade.assignmentTitle || '';
    const kind = /cuối kỳ/i.test(title) ? 'final' : /giữa kỳ/i.test(title) ? 'midterm' : 'regular';
    const maxScore = Number(grade.maxScore) || 10;
    classScores[kind].push((Number(grade.score) || 0) / maxScore * 10);
    scoresByClass.set(grade.classId, classScores);
  });
  const subjectResults = semesterClasses.map((item) => {
    const scores = scoresByClass.get(item.id);
    if (!scores?.final.length) return { ...item, finalScore: null };
    const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    return { ...item, finalScore: average(scores.regular) * 0.2 + average(scores.midterm) * 0.3 + average(scores.final) * 0.5 };
  });
  const totalCredits = subjectResults.reduce((sum, item) => sum + (Number(item.subjectCredits) || 0), 0);
  const passedCredits = subjectResults.reduce((sum, item) => sum + (item.finalScore >= 5 ? Number(item.subjectCredits) || 0 : 0), 0);
  const stats = [
    { icon: <BookOutlined />, label: 'Lớp đã đăng ký', value: workflow?.classes?.length, color: '#2563eb' },
    { icon: <FileDoneOutlined />, label: 'Bài đã nộp', value: submitted, color: '#14b8a6' },
    { icon: <CheckCircleOutlined />, label: 'Bài đã chấm', value: graded, color: '#f59e0b' },
    { icon: <BarChartOutlined />, label: 'Điểm trung bình', value: workflow?.studentGrades?.averageScore ? scoreText(workflow.studentGrades.averageScore) : 0, color: '#8b5cf6' },
  ];

  return (
    <DashboardShell title="Tổng quan sinh viên" subtitle="Theo dõi tiến độ học tập và kết quả của bạn." stats={stats} hideHeading={hideHeading}>
      <div className="dashboard-chart-grid dashboard-student-grid">
        <Panel title="Kết quả học tập" icon={<BarChartOutlined />}>
          <select className="dashboard-semester-select" value={selectedSemester || ''} onChange={(event) => setSemester(event.target.value)} aria-label="Học kỳ kết quả học tập">
            {semesters.length ? semesters.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Chưa có học kỳ</option>}
          </select>
          {subjectResults.some((item) => item.finalScore != null)
            ? <BarChart items={subjectResults.filter((item) => item.finalScore != null).map((item) => ({ label: item.subjectCode || item.name, value: Number(item.finalScore.toFixed(1)), color: '#fb6b55' }))} />
            : <p className="dashboard-empty">Chưa có điểm tổng kết.</p>}
        </Panel>
        <Panel title="Tiến độ học tập" icon={<PieChartOutlined />}><RingChart value={percent(passedCredits, totalCredits)} label="tín chỉ đạt" caption={`${passedCredits}/${totalCredits} tín chỉ`} color="#28d993" /></Panel>
        <Panel title="Lớp học phần" icon={<BookOutlined />}>
          <select className="dashboard-semester-select" value={selectedSemester || ''} onChange={(event) => setSemester(event.target.value)} aria-label="Học kỳ lớp học phần">
            {semesters.length ? semesters.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Chưa có học kỳ</option>}
          </select>
          <div className="dashboard-subject-list">
            <div className="dashboard-subject-row dashboard-subject-header"><span>Môn học</span><span>Tín chỉ</span></div>
            {semesterClasses.map((item) => <div className="dashboard-subject-row" key={item.id}><span>{item.subjectTitle || item.name}</span><span>{item.subjectCredits ?? 0}</span></div>)}
            {!semesterClasses.length && <p className="dashboard-empty">Chưa đăng ký lớp học phần.</p>}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

function DashboardShell({ title, subtitle, stats, children, hideHeading = false }) {
  return (
    <div className="dashboard-overview">
      {!hideHeading && (
        <div className="dashboard-overview-heading">
          <div><h2>{title}</h2><p>{subtitle}</p></div>
          <span className="dashboard-live-dot">Dữ liệu trực tiếp</span>
        </div>
      )}
      <div className={`dashboard-stats-grid${stats.length === 3 ? ' dashboard-stats-grid--three' : ''}`}>{stats.map((item) => <StatCard key={item.label} {...item} />)}</div>
      {children}
    </div>
  );
}
