import { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme, message } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ClassSelectorPanel from '../../components/ClassSelectorPanel';
import { StudentDashboardOverview } from '../../components/DashboardOverview';
import axiosClient from '../../api/axiosClient';
import useDashboardWorkflow from '../../hooks/useDashboardWorkflow';
import { fileHref, formatDate, score, statusLabel } from '../../utils/dashboardDisplay';
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
  grades: 'Điểm của tôi',
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
    { key: 'grades', icon: <BarChartOutlined />, label: 'Điểm của tôi' },
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
      <div className="panel-heading"><h2>Bài tập của lớp</h2><span>{selectedClass?.name || ''}</span></div>
      <div className="student-assignment-list">
        {assignments.map((assignment) => {
          const submission = submittedByAssignment[assignment.id];
          const overdue = isPastDue(assignment.dueDate);
          const locked = classClosed || overdue;
          return (
            <article className="student-assignment" key={assignment.id}>
              <div>
                <h3>{assignment.title}</h3>
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
  return (
    <section className="panel wide feature-grades">
      <div className="panel-heading"><h2>Điểm của tôi</h2><span>TB {score(workflow.studentGrades?.averageScore)}</span></div>
      <div className="compact-list">
        {workflow.studentGrades?.grades?.map((grade) => (
          <article key={grade.id}>
            <strong>{grade.assignmentTitle}</strong>
            <span>{score(grade.score)} / {score(grade.maxScore)}</span>
            <span>{grade.feedback || 'Chưa có nhận xét'}</span>
          </article>
        ))}
        {(!workflow.studentGrades?.grades || workflow.studentGrades.grades.length === 0) && <p className="empty">Chưa có điểm.</p>}
      </div>
    </section>
  );
}
