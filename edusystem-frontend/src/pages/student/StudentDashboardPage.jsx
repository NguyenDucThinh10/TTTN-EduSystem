import { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Space, Table, Tag, theme, message } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  ReadOutlined,
  UserOutlined,
  RobotOutlined // --- BỔ SUNG: Icon cho AI ---
} from '@ant-design/icons';
import ClassSelectorPanel from '../../components/ClassSelectorPanel';
import { StudentDashboardOverview } from '../../components/DashboardOverview';
import axiosClient from '../../api/axiosClient';
import { createTuitionPaymentRequest, getMyTuitionSummary } from '../../api/tuitionApi';
import useDashboardWorkflow from '../../hooks/useDashboardWorkflow';
import { fileHref, formatDate, score, statusLabel } from '../../utils/dashboardDisplay';
// --- BỔ SUNG: Import Component Trợ giảng AI ---
import AITutorDrawer from '../../components/AITutorDrawer'; 
import '../../styles/roleDashboard.css';
import './StudentDashboard.css';

const { Header, Sider, Content, Footer } = Layout;

const pageTitles = {
  overview: 'Tổng quan',
  registration: 'Đăng ký học phần',
  classes: 'Lớp của tôi',
  schedule: 'Thời khóa biểu',
  attendance: 'Điểm danh',
  assignments: 'Bài tập',
  submissions: 'Bài đã nộp',
  grades: 'Kết quả học tập',
  tuitionPayment: 'Nộp học phí',
  tuitionDebt: 'Tra cứu công nợ',
};

const isPastDue = (dueDate) => dueDate && new Date(dueDate).getTime() < Date.now();

const attendanceMeta = {
  PRESENT: { label: 'Có mặt', className: 'present' },
  ABSENT: { label: 'Vắng', className: 'absent' },
  LATE: { label: 'Đi trễ', className: 'late' },
  EXCUSED: { label: 'Có phép', className: 'excused' },
  PENDING: { label: 'Chờ duyệt', className: 'late' },
};

const dayLabels = {
  MONDAY: 'Thứ 2',
  TUESDAY: 'Thứ 3',
  WEDNESDAY: 'Thứ 4',
  THURSDAY: 'Thứ 5',
  FRIDAY: 'Thứ 6',
  SATURDAY: 'Thứ 7',
  SUNDAY: 'Chủ nhật',
};

export default function StudentDashboardPage({ user, onLogout }) {
  const workflow = useDashboardWorkflow(user);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [schedules, setSchedules] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = useMemo(() => [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'registration', icon: <BookOutlined />, label: 'Đăng ký học phần' },
    { key: 'classes', icon: <ReadOutlined />, label: 'Lớp của tôi' },
    { key: 'schedule', icon: <CalendarOutlined />, label: 'Thời khóa biểu' },
    { key: 'attendance', icon: <CheckSquareOutlined />, label: 'Điểm danh' },
    { key: 'assignments', icon: <ReadOutlined />, label: 'Bài tập' },
    { key: 'submissions', icon: <FileDoneOutlined />, label: 'Bài đã nộp' },
    { key: 'grades', icon: <BarChartOutlined />, label: 'Kết quả học tập' },
    { key: 'tuitionPayment', icon: <DollarOutlined />, label: 'Nộp học phí' },
    { key: 'tuitionDebt', icon: <DollarOutlined />, label: 'Tra cứu công nợ' },
  ], []);

  const userName = user.username || 'student';
  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: userName },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: onLogout },
    ],
  };

  const showClassSelector = ['attendance', 'assignments', 'submissions', 'grades'].includes(activeView);

  useEffect(() => {
    axiosClient.get('/api/schedules/me')
      .then((data) => setSchedules(Array.isArray(data) ? data : []))
      .catch(() => message.error('Không thể tải thời khóa biểu'));
    axiosClient.get('/api/attendance/me')
      .then((data) => setAttendanceRecords(Array.isArray(data) ? data : []))
      .catch(() => message.error('Không thể tải dữ liệu điểm danh'));
  }, []);

  const onSelfSubmitAttendance = async () => {
    if (!workflow.selectedClassId) {
      message.warning('Vui lòng chọn lớp để nộp điểm danh');
      return;
    }
    try {
      const saved = await axiosClient.post('/api/attendance/self', {
        classId: workflow.selectedClassId,
        attendanceDate,
        status: 'PENDING',
        note: 'Sinh viên tự nộp điểm danh',
      });
      setAttendanceRecords((records) => {
        const next = records.filter((item) => item.id !== saved.id);
        return [saved, ...next];
      });
      message.success('Đã nộp điểm danh, chờ giáo viên xác nhận');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || error.response?.data || 'Nộp điểm danh thất bại');
    }
  };

  return (
    <Layout className="role-dashboard">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} className="role-sider">
        <div className="role-logo">{collapsed ? 'LMS' : 'EDUSYSTEM'}</div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeView]} items={menuItems} onClick={({ key }) => setActiveView(key)} />
      </Sider>

      <Layout>
        <Header className="role-header" style={{ background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="role-collapse"
          />
          <Space size="large" className="role-header-actions">
            <Badge count={workflow.notice ? 1 : 0} size="small">
              <Button type="text" shape="circle" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Space className="role-user">
                <Avatar style={{ backgroundColor: '#52c41a' }} icon={<UserOutlined />} />
                <strong>{userName}</strong>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="role-content">
          <div className="role-titlebar">
            <h1>{pageTitles[activeView]}</h1>
            <Space>
              <Button type="text" shape="circle" icon={<ReloadOutlined />} title="Làm mới" aria-label="Làm mới" onClick={workflow.onRefresh} loading={workflow.loading} />
              <Breadcrumb items={[{ title: 'Student' }, { title: pageTitles[activeView] }]} />
            </Space>
          </div>

          <div className="role-content-card" style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
            {showClassSelector && (
              <ClassSelectorPanel
                classes={workflow.classes}
                selectedClass={workflow.selectedClass}
                selectedClassId={workflow.selectedClassId}
                onClassChange={workflow.setSelectedClassId}
              />
            )}
            {workflow.notice && <div className="notice">{workflow.notice}</div>}
            {workflow.loading && <div className="loading-line">Đang tải dữ liệu...</div>}
            {activeView === 'overview' && <StudentOverview workflow={workflow} />}
            {activeView === 'registration' && <CourseRegistration workflow={workflow} />}
            {activeView === 'classes' && <MyClasses workflow={workflow} />}
            {activeView === 'schedule' && <StudentSchedule schedules={schedules} />}
            {activeView === 'attendance' && (
              <StudentAttendance
                workflow={workflow}
                attendanceDate={attendanceDate}
                attendanceRecords={attendanceRecords}
                onAttendanceDateChange={setAttendanceDate}
                onSelfSubmitAttendance={onSelfSubmitAttendance}
              />
            )}
            {activeView === 'assignments' && <StudentAssignments workflow={workflow} />}
            {activeView === 'submissions' && <StudentSubmissions workflow={workflow} />}
            {activeView === 'grades' && <StudentGrades workflow={workflow} />}
            {activeView === 'tuitionPayment' && <StudentTuition mode="payment" user={user} />}
            {activeView === 'tuitionDebt' && <StudentTuition mode="debt" user={user} />}
          </div>
        </Content>

        <Footer className="role-footer">EduSystem ©{new Date().getFullYear()} Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
}

function StudentOverview({ workflow }) {
  return <StudentDashboardOverview workflow={workflow} />;
}

function CourseRegistration({ workflow }) {
  return (
    <section className="panel wide feature-registration">
      <div className="panel-heading">
        <h2>Học phần đang mở</h2>
        <span>{workflow.openClasses.length} lớp</span>
      </div>
      <div className="student-assignment-list">
        {workflow.openClasses.map((classItem) => (
          <article className="student-assignment" key={classItem.id}>
            <div>
              <h3>{classItem.courseCode || 'N/A'} - {classItem.courseTitle}</h3>
              <p>{classItem.name} | {classItem.courseCredits || 0} tín chỉ</p>
              <span>{classItem.teacherName || 'Chưa phân công'} | {classItem.semester || 'Học kỳ'} | {classItem.studentCount ?? 0} sinh viên</span>
            </div>
            <div className="submit-box">
              <span className={`badge ${classItem.enrolled ? 'GRADED' : ''}`}>{classItem.enrolled ? 'Đã đăng ký' : statusLabel(classItem.status)}</span>
              {classItem.enrolled ? (
                <button type="button" className="danger" onClick={() => workflow.onCancelRegistration(classItem.id)}>Hủy đăng ký</button>
              ) : (
                <button type="button" onClick={() => workflow.onRegisterClass(classItem.id)}>Đăng ký</button>
              )}
            </div>
          </article>
        ))}
        {workflow.openClasses.length === 0 && <p className="empty">Hiện chưa có lớp/học phần đang mở.</p>}
      </div>
    </section>
  );
}

function MyClasses({ workflow }) {
  return (
    <section className="panel wide feature-classes">
      <div className="panel-heading">
        <h2>Lớp của tôi</h2>
        <span>{workflow.classes.length} lớp</span>
      </div>
      <div className="student-assignment-list">
        {workflow.classes.map((classItem) => (
          <article className="student-assignment" key={classItem.id}>
            <div>
              <h3>{classItem.name}</h3>
              <p>{classItem.courseCode || 'N/A'} - {classItem.courseTitle}</p>
              <span>{classItem.courseCredits || 0} tín chỉ | {classItem.teacherName || 'Chưa phân công'} | {classItem.semester || 'Học kỳ'} | {statusLabel(classItem.status)}</span>
            </div>
            <div className="submit-box">
              <span className="badge GRADED">Đã đăng ký</span>
            </div>
          </article>
        ))}
        {workflow.classes.length === 0 && <p className="empty">Bạn chưa đăng ký lớp nào.</p>}
      </div>
    </section>
  );
}
function StudentSchedule({ schedules }) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  return (
    <section className="panel wide feature-schedule">
      <div className="panel-heading">
        <h2>Lịch học tuần này</h2>
        <span>{schedules.length} buổi học</span>
      </div>
      <div className="student-schedule-list">
        {days.map((day) => {
          const lessons = schedules.filter((item) => dayLabels[item.dayOfWeek] === day);
          return (
            <article className="student-day-card" key={day}>
              <div className="student-day-title">
                <strong>{day}</strong>
                <span>{lessons.length ? `${lessons.length} buổi` : 'Không có lịch'}</span>
              </div>
              <div className="student-day-lessons">
                {lessons.map((lesson) => (
                  <div className="schedule-slot" key={lesson.id}>
                    <strong>{lesson.startTime?.slice(0, 5)} - {lesson.endTime?.slice(0, 5)}</strong>
                    <span>{lesson.className} | {lesson.subject || lesson.courseTitle}</span>
                    <span>{lesson.room || 'Chưa có phòng'} | {lesson.teacherName}</span>
                  </div>
                ))}
                {lessons.length === 0 && <span className="empty">Trống</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StudentAttendance({ workflow, attendanceDate, attendanceRecords, onAttendanceDateChange, onSelfSubmitAttendance }) {
  const attendedCount = attendanceRecords.filter((item) => ['PRESENT', 'LATE'].includes(item.status)).length;
  const rate = attendanceRecords.length ? Math.round((attendedCount / attendanceRecords.length) * 100) : 0;

  return (
    <section className="panel wide feature-attendance">
      <div className="panel-heading">
        <h2>Chuyên cần của tôi</h2>
        <span>{rate}% tham gia</span>
      </div>
      <div className="attendance-toolbar">
        <input type="date" value={attendanceDate} onChange={(event) => onAttendanceDateChange(event.target.value)} />
        <Button type="primary" icon={<CheckSquareOutlined />} onClick={onSelfSubmitAttendance} disabled={!workflow.selectedClassId}>
          Điểm danh
        </Button>
      </div>
      <div className="metrics attendance-summary">
        <div><strong>{attendanceRecords.length}</strong><span>Tổng buổi</span></div>
        <div><strong>{attendanceRecords.filter((item) => item.status === 'PRESENT').length}</strong><span>Có mặt</span></div>
        <div><strong>{attendanceRecords.filter((item) => item.status === 'LATE').length}</strong><span>Đi trễ</span></div>
        <div><strong>{attendanceRecords.filter((item) => ['ABSENT', 'EXCUSED'].includes(item.status)).length}</strong><span>Nghỉ</span></div>
      </div>
      <div className="compact-list attendance-history">
        {attendanceRecords.map((item) => {
          const meta = attendanceMeta[item.status];
          return (
            <article key={item.id}>
              <strong>{item.attendanceDate} | {item.className}</strong>
              <span>{item.markedByName ? `Người ghi nhận: ${item.markedByName}` : 'Chưa có người xác nhận'}</span>
              <span>{item.note}</span>
              <span className={`attendance-pill ${meta?.className || 'late'}`}>{meta?.label || item.status}</span>
            </article>
          );
        })}
        {attendanceRecords.length === 0 && <p className="empty">Chưa có dữ liệu điểm danh.</p>}
      </div>
    </section>
  );
}

function StudentAssignments({ workflow }) {
  // --- BỔ SUNG: State mở/tắt Drawer Trợ giảng AI ---
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const {
    assignments,
    onCancelSubmission,
    onFileChange,
    onResubmit,
    onUpload,
    selectedClass,
    submittedByAssignment,
    uploadFiles,
  } = workflow;

  const classClosed = selectedClass?.status === 'COMPLETED';

  return (
    <section className="panel wide feature-assignments">
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Bài tập của lớp</h2>
          <span>{selectedClass?.name || ''}</span>
        </div>
        
        {/* --- BỔ SUNG: Nút gọi Trợ giảng AI phong cách trắng viền tím --- */}
        <Button 
          type="primary" 
          icon={<RobotOutlined />} 
          onClick={() => setIsTutorOpen(true)}
          style={{ 
              backgroundColor: '#c3d0ee', 
              borderColor: '#722ed1', 
              color: '#ffffff' /* Ép cứng chữ màu trắng */ 
          }}
        >
          Hỏi Trợ giảng AI
        </Button>
      </div>

      <div className="student-assignment-list">
        {assignments.map((assignment) => {
          const submission = submittedByAssignment[assignment.id];
          const overdue = isPastDue(assignment.dueDate);
          const locked = classClosed || overdue;
          const kind = assignmentKindMeta(assignment);
          return (
            <article className="student-assignment" key={assignment.id}>
              <div>
                <h3><span className={`assignment-kind ${kind.className}`}>{kind.label}</span>{cleanAssignmentTitle(assignment.title)}</h3>
                <p>{assignment.description || 'Không có mô tả.'}</p>
                <span>Hạn nộp: {formatDate(assignment.dueDate)} | Điểm: {score(assignment.maxScore)}</span>
                <span className={`badge ${submission?.status || (overdue ? 'LATE' : 'missing')}`}>
                  {submission ? statusLabel(submission.status) : overdue ? 'Quá hạn' : 'Chưa nộp'}
                </span>
                {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tải đề bài</a>}
              </div>
              <div className="submit-box">
                {submission ? (
                  <>
                    <strong>{submission.score != null ? `${score(submission.score)} điểm` : 'Chưa chấm'}</strong>
                    {submission.fileUrl && <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">File đã nộp</a>}
                    <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} disabled={locked} />
                    <button type="button" onClick={() => onResubmit(assignment.id)} disabled={locked || !uploadFiles[assignment.id]}>Nộp lại</button>
                    <button type="button" className="danger" onClick={() => onCancelSubmission(submission.id)} disabled={locked}>Hủy nộp</button>
                  </>
                ) : (
                  <>
                    <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} disabled={locked} />
                    <button type="button" onClick={() => onUpload(assignment.id)} disabled={locked || !uploadFiles[assignment.id]}>Nộp bài</button>
                  </>
                )}
                {locked && <span>{classClosed ? 'Lớp đã kết thúc' : 'Đã quá hạn nộp'}</span>}
              </div>
            </article>
          );
        })}
        {assignments.length === 0 && <p className="empty">Lớp này chưa có bài tập.</p>}
      </div>

      {/* --- BỔ SUNG: Render Drawer Trợ giảng AI --- */}
      <AITutorDrawer visible={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
    </section>
  );
}

function StudentSubmissions({ workflow }) {
  return (
    <section className="panel wide feature-submissions">
      <div className="panel-heading"><h2>Bài đã nộp</h2><span>{workflow.mySubmissions.length} bài</span></div>
      <div className="compact-list">
        {workflow.mySubmissions.map((submission) => (
          <article key={submission.id}>
            <strong>{submission.assignmentTitle}</strong>
            <span>{formatDate(submission.submittedAt)} | {statusLabel(submission.status)}</span>
            <span>{submission.score != null ? `${score(submission.score)} điểm` : 'Chưa chấm'}</span>
            {submission.fileUrl && <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">Tải file</a>}
          </article>
        ))}
        {workflow.mySubmissions.length === 0 && <p className="empty">Bạn chưa nộp bài nào.</p>}
      </div>
    </section>
  );
}

function StudentGrades({ workflow }) {
  const grades = workflow.studentGrades?.grades || [];
  const selectedClass = workflow.selectedClass || {};
  const byKind = grades.reduce((groups, grade) => {
    const kind = assignmentKindMeta({ title: grade.assignmentTitle }).className;
    const maxScore = Number(grade.maxScore || 10);
    const normalizedScore = maxScore > 0 ? (Number(grade.score || 0) / maxScore) * 10 : Number(grade.score || 0);
    groups[kind].push(normalizedScore);
    return groups;
  }, { regular: [], midterm: [], final: [] });
  const regularScore = averageLearningScore(byKind.regular);
  const midtermScore = averageLearningScore(byKind.midterm);
  const finalScore = averageLearningScore(byKind.final);
  const processScore = regularScore == null && midtermScore == null
    ? null
    : (((regularScore ?? 0) * 0.2) + ((midtermScore ?? 0) * 0.3)) / 0.5;
  const finalSummaryScore = ((regularScore ?? 0) * 0.2) + ((midtermScore ?? 0) * 0.3) + ((finalScore ?? 0) * 0.5);
  const gradeMeta = learningGradeMeta(finalSummaryScore);
  const row = {
    code: selectedClass.courseCode || workflow.studentGrades?.className || selectedClass.name || '-',
    title: selectedClass.courseTitle || selectedClass.name || workflow.studentGrades?.className || '-',
    credits: selectedClass.courseCredits ?? '-',
    processScore,
    finalScore,
    finalSummaryScore,
    gradeMeta,
    passed: finalSummaryScore >= 5,
  };

  return (
    <section className="panel wide feature-grades learning-result-panel">
      <div className="panel-heading"><h2>Kết quả học tập</h2><span>{selectedClass.semester || 'Học kỳ hiện tại'}</span></div>
      <div className="learning-tabs">
        <button type="button" className="active">Bảng điểm học tập</button>
      </div>
      <div className="learning-board">
        <div className="learning-table-wrap">
          <table className="learning-table">
            <thead>
              <tr>
                <th>TT</th>
                <th>Mã lớp học phần</th>
                <th>Tên môn học/học phần</th>
                <th>Số tín chỉ</th>
                <th>Điểm quá trình</th>
                <th>Điểm cuối kỳ</th>
                <th>Điểm tổng kết</th>
                <th>Điểm hệ 4</th>
                <th>Điểm chữ</th>
                <th>Xếp loại</th>
                <th>Đạt</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr className="semester-row">
                <td colSpan="12">{selectedClass.semester || 'Học kỳ hiện tại'}</td>
              </tr>
              {grades.length > 0 ? (
                <tr>
                  <td>1</td>
                  <td>{row.code}</td>
                  <td>{row.title}</td>
                  <td>{row.credits}</td>
                  <td>{row.processScore == null ? '-' : score(row.processScore)}</td>
                  <td>{row.finalScore == null ? '-' : score(row.finalScore)}</td>
                  <td>{score(row.finalSummaryScore)}</td>
                  <td>{row.gradeMeta.point4.toFixed(2)}</td>
                  <td>{row.gradeMeta.letter}</td>
                  <td>{row.gradeMeta.rank}</td>
                  <td>{row.passed ? '✓' : '-'}</td>
                  <td>{row.passed ? '' : 'Chưa đạt'}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="12" className="learning-empty">Chưa có điểm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="learning-summary">
          <p>Điểm trung bình học kỳ (hệ 10): <strong>{grades.length ? score(row.finalSummaryScore) : '-'}</strong></p>
          <p>Điểm trung bình tích lũy (hệ 10): <strong>{grades.length ? score(row.finalSummaryScore) : '-'}</strong></p>
          <p>Điểm trung bình học kỳ (hệ 4): <strong>{grades.length ? row.gradeMeta.point4.toFixed(2) : '-'}</strong></p>
          <p>Điểm trung bình tích lũy (hệ 4): <strong>{grades.length ? row.gradeMeta.point4.toFixed(2) : '-'}</strong></p>
          <p>Xếp loại học lực học kỳ: <strong>{grades.length ? row.gradeMeta.rank : '-'}</strong></p>
          <p>Xếp loại học lực tích lũy: <strong>{grades.length ? row.gradeMeta.rank : '-'}</strong></p>
          <p>Tổng số tín chỉ học kỳ đạt: <strong>{row.passed ? row.credits : 0}</strong></p>
          <p>Tổng số tín chỉ đã đăng ký: <strong>{row.credits}</strong></p>
          <p>Điểm rèn luyện học kỳ: <strong>83.00</strong></p>
          <p>Tổng số tín chỉ nợ tính đến hiện tại: <strong>{row.passed ? 0 : row.credits}</strong></p>
        </div>
      </div>
    </section>
  );
}

const formatTuitionMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

const tuitionStatusMeta = {
  PAID: { color: 'green', label: 'Đã đóng đủ' },
  PARTIAL: { color: 'gold', label: 'Đóng một phần' },
  UNPAID: { color: 'red', label: 'Chưa đóng' },
};

const assignmentKindMeta = (assignment = {}) => {
  const title = assignment.title || '';
  if (/^\[?Cuối kỳ\]?/i.test(title) || /\bcuối kỳ\b/i.test(title)) {
    return { label: 'Cuối kỳ', className: 'final' };
  }
  if (/^\[?Giữa kỳ\]?/i.test(title) || /\bgiữa kỳ\b/i.test(title)) {
    return { label: 'Giữa kỳ', className: 'midterm' };
  }
  return { label: 'Bài tập', className: 'regular' };
};

const cleanAssignmentTitle = (title = '') => title.replace(/^\[(Giữa kỳ|Cuối kỳ)\]\s*/i, '');

const averageLearningScore = (scores) => {
  if (!scores.length) return null;
  return scores.reduce((total, item) => total + item, 0) / scores.length;
};

const learningGradeMeta = (value = 0) => {
  if (value >= 8.5) return { point4: 4, letter: 'A', rank: 'Giỏi' };
  if (value >= 8) return { point4: 3.5, letter: 'B+', rank: 'Khá' };
  if (value >= 7) return { point4: 3, letter: 'B', rank: 'Khá' };
  if (value >= 6.5) return { point4: 2.5, letter: 'C+', rank: 'Trung bình' };
  if (value >= 5.5) return { point4: 2, letter: 'C', rank: 'Trung bình' };
  if (value >= 5) return { point4: 1.5, letter: 'D+', rank: 'Đạt' };
  if (value >= 4) return { point4: 1, letter: 'D', rank: 'Yếu' };
  return { point4: 0, letter: 'F', rank: 'Kém' };
};

const tuitionPaymentStatusMeta = {
  PENDING: { color: 'blue', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'green', label: 'Đã xác nhận' },
  REJECTED: { color: 'red', label: 'Từ chối' },
};

function StudentTuition({ mode, user }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLineKeys, setSelectedLineKeys] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [paymentProfile, setPaymentProfile] = useState({});
  const [lineAmounts, setLineAmounts] = useState({});

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await getMyTuitionSummary();
      setSummary(data);
      setSelectedLineKeys((data?.lines || []).map((line) => `${line.classId}-${line.courseId}`));
      setLineAmounts(Object.fromEntries((data?.lines || []).map((line) => [`${line.classId}-${line.courseId}`, Number(line.amount || 0)])));
    } catch (error) {
      console.error(error);
      message.error('Không thể tải dữ liệu học phí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const lines = summary?.lines || [];
  const lineKey = (line) => `${line.classId}-${line.courseId}`;
  const selectedLines = lines.filter((line) => selectedLineKeys.includes(lineKey(line)));
  const selectedAmount = selectedLines.reduce((total, line) => total + Number(lineAmounts[lineKey(line)] ?? line.amount ?? 0), 0);
  const paidAmount = Number(summary?.paidAmount || 0);
  const pendingAmount = Number(summary?.pendingAmount || 0);
  const debtAmount = Number(summary?.debtAmount || 0);
  const deductionAmount = Math.min(paidAmount, selectedAmount);
  const payableAmount = Math.max(selectedAmount - deductionAmount, 0);
  const studentName = user?.fullName || sessionStorage.getItem('fullName') || summary?.studentName || 'Trương Công Lý';
  const profile = {
    studentCode: '',
    studentName,
    birthDate: '',
    major: 'Công nghệ thông tin',
    program: 'Chuẩn (đại trà)',
    ...paymentProfile,
  };

  const updateProfile = (field, value) => {
    setPaymentProfile((current) => ({ ...current, [field]: value }));
  };

  const updateLineAmount = (key, value) => {
    const normalizedValue = Number(String(value).replace(/\D/g, '')) || 0;
    setLineAmounts((current) => ({ ...current, [key]: normalizedValue }));
  };

  const toggleLine = (key) => {
    setSelectedLineKeys((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ));
  };

  const submitPayment = async () => {
    const amount = Math.max(payableAmount || selectedAmount, 0);
    if (!amount) {
      message.warning('Vui lòng chọn khoản học phí cần thanh toán');
      return;
    }

    try {
      await createTuitionPaymentRequest({
        amount,
        note: `Thanh toán học phí qua ${paymentMethod}`,
      });
      message.success(`Thanh toán ${paymentMethod} thành công. Đã gửi thông báo cho admin xác nhận.`);
      fetchSummary();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Gửi yêu cầu nộp học phí thất bại');
    }
  };
  return (
    <section className="panel wide feature-tuition">
      <div className="panel-heading">
        <h2>{mode === 'payment' ? 'Nộp học phí' : 'Tra cứu công nợ'}</h2>
        <span>1 tín chỉ = {formatTuitionMoney(400000)}</span>
      </div>

      {mode === 'payment' && (
        <div className="online-payment">
          <h1>THANH TOÁN TRỰC TUYẾN</h1>

          <div className="online-student-info">
            <label><strong>Mã số SV:</strong><input value={profile.studentCode} onChange={(event) => updateProfile('studentCode', event.target.value)} /></label>
            <label><strong>Họ và tên:</strong><input value={profile.studentName} onChange={(event) => updateProfile('studentName', event.target.value)} /></label>
            <label><strong>Ngày sinh:</strong><input value={profile.birthDate} onChange={(event) => updateProfile('birthDate', event.target.value)} /></label>
            <label><strong>Ngành:</strong><input value={profile.major} onChange={(event) => updateProfile('major', event.target.value)} /></label>
            <label><strong>Chương trình đào tạo:</strong><input value={profile.program} onChange={(event) => updateProfile('program', event.target.value)} /></label>
          </div>

          <div className="online-payment-box">
            <div className="online-payment-header">Các khoản đóng phí</div>
            <div className="online-payment-body">
              <h2>Nội dung thu</h2>
              <div className="online-fee-list">
                {lines.map((line) => {
                  const key = lineKey(line);
                  return (
                    <label className="online-fee-item" key={key}>
                      <input
                        type="checkbox"
                        checked={selectedLineKeys.includes(key)}
                        onChange={() => toggleLine(key)}
                      />
                      <span>{line.courseTitle || line.className}</span>
                      <input
                        className="online-money-input"
                        value={lineAmounts[key] ?? line.amount ?? 0}
                        onChange={(event) => updateLineAmount(key, event.target.value)}
                      />
                    </label>
                  );
                })}
                {lines.length === 0 && <p className="empty">Chưa có khoản học phí cần thanh toán.</p>}
              </div>

              <div className="online-payment-totals">
                <label><strong>Tổng học phí:</strong><input readOnly value={formatTuitionMoney(selectedAmount)} /></label>
                <label><strong>Dư nợ:</strong><input readOnly value={formatTuitionMoney(debtAmount)} /></label>
                <label><strong>Khấu trừ:</strong><input readOnly value={formatTuitionMoney(deductionAmount)} /></label>
                <label><strong>Chờ admin xác nhận:</strong><input readOnly value={formatTuitionMoney(pendingAmount)} /></label>
                <label><strong>Số tiền phải đóng:</strong><input readOnly value={formatTuitionMoney(payableAmount)} /></label>
                <label><strong>Số tiền thanh toán:</strong><input readOnly value={formatTuitionMoney(payableAmount)} /></label>
              </div>

              <h3>Phương thức thanh toán:</h3>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method ${paymentMethod === 'VNPAY' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('VNPAY')}
                >
                  <span className="method-mark vnpay-mark">V</span>
                  <span>VNPAY</span>
                </button>
                <button
                  type="button"
                  className={`payment-method ${paymentMethod === 'MoMo' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('MoMo')}
                >
                  <span className="method-mark momo-mark">mo<br />mo</span>
                  <span>MoMo</span>
                </button>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<DollarOutlined />}
                loading={loading}
                disabled={!selectedAmount}
                onClick={submitPayment}
                className="online-pay-button"
              >
                Thanh toán qua {paymentMethod}
              </Button>
            </div>
          </div>
        </div>
      )}
      {mode === 'debt' && (
        <>
          <Table
            title={() => 'Chi tiết học phí theo học phần'}
            size="small"
            rowKey={(line) => `${line.classId}-${line.courseId}`}
            dataSource={summary?.lines || []}
            loading={loading}
            pagination={false}
            columns={[
              { title: 'Học phần', render: (_, line) => `${line.courseCode} - ${line.courseTitle}` },
              { title: 'Lớp', dataIndex: 'className' },
              { title: 'Học kỳ', dataIndex: 'semester' },
              { title: 'Tín chỉ', dataIndex: 'credits', width: 90 },
              { title: 'Học phí', dataIndex: 'amount', render: formatTuitionMoney },
            ]}
            style={{ marginBottom: 24 }}
          />

          <Table
            title={() => 'Lịch sử nộp học phí'}
            size="small"
            rowKey="id"
            dataSource={summary?.payments || []}
            loading={loading}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Ngày tạo', dataIndex: 'createdAt', render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '' },
              { title: 'Số tiền', dataIndex: 'amount', render: formatTuitionMoney },
              { title: 'Ghi chú', dataIndex: 'note' },
              {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (status) => <Tag color={tuitionPaymentStatusMeta[status]?.color}>{tuitionPaymentStatusMeta[status]?.label || status}</Tag>,
              },
            ]}
          />
        </>
      )}    </section>
  );
}
