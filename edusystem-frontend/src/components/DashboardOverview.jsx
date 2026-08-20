import { useMemo } from 'react';
import {
  BarChartOutlined,
  BookOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
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

function HorizontalBars({ items, valueSuffix = '' }) {
  const max = Math.max(...items.map((item) => numberValue(item.value)), 1);
  return (
    <div className="dashboard-horizontal-bars">
      {items.map((item, index) => (
        <div className="dashboard-horizontal-row" key={item.label}>
          <div className="dashboard-horizontal-label"><strong>{item.label}</strong><span>{item.hint}</span></div>
          <div className="dashboard-horizontal-track"><i style={{ width: `${(numberValue(item.value) / max) * 100}%`, background: item.color || colors[index % colors.length] }} /></div>
          <b>{item.value ?? 0}{valueSuffix}</b>
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
    { icon: <TeamOutlined />, label: 'Sinh viên', value: dashboard?.totalStudents, hint: `${dashboard?.totalTeachers ?? 0} giảng viên`, color: '#14b8a6' },
    { icon: <BookOutlined />, label: 'Lớp học', value: dashboard?.totalClasses, hint: `${dashboard?.totalCourses ?? 0} học phần`, color: '#f59e0b' },
    { icon: <FileDoneOutlined />, label: 'Bài nộp', value: dashboard?.totalSubmissions, hint: `${dashboard?.totalGradedSubmissions ?? 0} đã chấm`, color: '#8b5cf6' },
  ], [dashboard]);

  return (
    <DashboardShell title="Tổng quan hệ thống" subtitle="Số liệu được tổng hợp trực tiếp từ cơ sở dữ liệu EduSystem." stats={stats}>
      <div className="dashboard-chart-grid">
        <Panel title="Quy mô hệ thống" icon={<TeamOutlined />}><BarChart items={[
          { label: 'Sinh viên', value: dashboard?.totalStudents },
          { label: 'Giảng viên', value: dashboard?.totalTeachers },
          { label: 'Học phần', value: dashboard?.totalCourses },
          { label: 'Lớp học', value: dashboard?.totalClasses },
          { label: 'Bài tập', value: dashboard?.totalAssignments },
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

export function TeacherDashboardOverview({ workflow }) {
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
    <DashboardShell title="Tổng quan giảng viên" subtitle={workflow?.selectedClass?.name ? `Đang xem dữ liệu của ${workflow.selectedClass.name}.` : 'Chọn một lớp để xem thống kê chi tiết.'} stats={stats}>
      <div className="dashboard-chart-grid">
        <Panel title="Kết quả học tập" icon={<BarChartOutlined />}><BarChart items={distribution.length ? distribution.map((item, index) => ({ label: item.label || item.range || 'Mức điểm', value: item.count, color: colors[index % colors.length] })) : [{ label: 'Chưa có điểm', value: 0 }]} /></Panel>
        <Panel title="Điểm trung bình lớp" icon={<CheckCircleOutlined />}><RingChart value={numberValue(analytics?.classAverage) * 10} label="/ 10 điểm" caption={`${scoreText(analytics?.classAverage)} điểm trung bình`} color="#2563eb" /></Panel>
        <Panel title="Tiến độ từng sinh viên" icon={<RiseOutlined />}><ProgressList items={progress.map((item) => ({ label: item.studentName || `SV ${item.studentId}`, value: item.completionRate }))} emptyText="Chưa có sinh viên hoặc bài tập." /></Panel>
        <Panel title="Thống kê bài tập" icon={<DatabaseOutlined />}><HorizontalBars items={assignmentStats.slice(0, 6).map((item) => ({ label: item.assignmentTitle, value: item.submissionCount, hint: `${item.gradedCount ?? 0} chấm | TB ${scoreText(item.averageScore)}` }))} /></Panel>
        <Panel title="Tổng quan nộp/chấm" icon={<PieChartOutlined />}><DonutChart centerLabel="bài" items={[
          { label: 'Đã chấm', value: gradedCount, color: '#14b8a6' },
          { label: 'Chưa chấm', value: Math.max(numberValue(submissionCount) - numberValue(gradedCount), 0), color: '#ef4444' },
          { label: 'Bài tập', value: analytics?.assignmentCount || workflow?.assignments?.length, color: '#f59e0b' },
        ]} /></Panel>
      </div>
    </DashboardShell>
  );
}

export function StudentDashboardOverview({ workflow }) {
  const total = workflow?.assignments?.length || 0;
  const submitted = workflow?.mySubmissions?.length || 0;
  const graded = workflow?.studentGrades?.grades?.length || 0;
  const completion = percent(submitted, total);
  const grades = workflow?.studentGrades?.grades || [];
  const stats = [
    { icon: <BookOutlined />, label: 'Lớp đã đăng ký', value: workflow?.classes?.length, color: '#2563eb' },
    { icon: <FileDoneOutlined />, label: 'Bài đã nộp', value: submitted, color: '#14b8a6' },
    { icon: <CheckCircleOutlined />, label: 'Bài đã chấm', value: graded, color: '#f59e0b' },
    { icon: <BarChartOutlined />, label: 'Điểm trung bình', value: workflow?.studentGrades?.averageScore ? scoreText(workflow.studentGrades.averageScore) : 0, color: '#8b5cf6' },
  ];

  return (
    <DashboardShell title="Tổng quan sinh viên" subtitle="Theo dõi tiến độ học tập và kết quả của bạn." stats={stats}>
      <div className="dashboard-chart-grid">
        <Panel title="Tiến độ bài tập" icon={<FileDoneOutlined />}><RingChart value={completion} label="đã hoàn thành" caption={`${submitted}/${total} bài đã nộp`} color="#14b8a6" /></Panel>
        <Panel title="Điểm từng bài" icon={<BarChartOutlined />}><HorizontalBars items={grades.slice(0, 6).map((grade) => ({ label: grade.assignmentTitle, value: grade.score, hint: `Tối đa ${scoreText(grade.maxScore)}` }))} /></Panel>
      </div>
    </DashboardShell>
  );
}

function DashboardShell({ title, subtitle, stats, children }) {
  return (
    <div className="dashboard-overview">
      <div className="dashboard-overview-heading">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <span className="dashboard-live-dot">Dữ liệu trực tiếp</span>
      </div>
      <div className="dashboard-stats-grid">{stats.map((item) => <StatCard key={item.label} {...item} />)}</div>
      {children}
    </div>
  );
}
