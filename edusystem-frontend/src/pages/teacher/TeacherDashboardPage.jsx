import { Fragment, useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Select, Space, theme, message } from 'antd';
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
  TeamOutlined,
  UserOutlined,
  RobotOutlined // --- BỔ SUNG: Icon cho nút AI ---
} from '@ant-design/icons';
import ClassSelectorPanel from '../../components/ClassSelectorPanel';
import { TeacherDashboardOverview } from '../../components/DashboardOverview';
import axiosClient from '../../api/axiosClient';
import useDashboardWorkflow from '../../hooks/useDashboardWorkflow';
import { fileHref, formatDate, score, statusLabel } from '../../utils/dashboardDisplay';
// --- BỔ SUNG: Import Component AI ---
import AIQuizGenerator from '../../components/AIQuizGenerator'; 
import '../../styles/roleDashboard.css';
import './TeacherDashboard.css';

const { Header, Sider, Content, Footer } = Layout;

const pageTitles = {
  overview: 'Tổng quan',
  classes: 'Lớp phụ trách',
  schedule: 'Thời khóa biểu',
  attendance: 'Điểm danh',
  assignments: 'Bài tập',
  submissions: 'Bài nộp',
  grading: 'Chấm điểm',
  analytics: 'Tổng kết',
};

const assignmentKindMeta = (assignment = {}) => {
  const title = assignment.title || '';
  if (/^\[?Cuối kỳ\]?/i.test(title) || /\bcuối kỳ\b/i.test(title)) {
    return { label: 'Cuối kỳ', className: 'final', key: 'final' };
  }
  if (/^\[?Giữa kỳ\]?/i.test(title) || /\bgiữa kỳ\b/i.test(title)) {
    return { label: 'Giữa kỳ', className: 'midterm', key: 'midterm' };
  }
  return { label: 'Bài tập', className: 'regular', key: 'regular' };
};

const cleanAssignmentTitle = (title = '') => title.replace(/^\[(Giữa kỳ|Cuối kỳ)\]\s*/i, '');

const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const attendanceMeta = {
  PRESENT: { label: 'Có mặt', short: 'C', className: 'present' },
  ABSENT: { label: 'Vắng', short: 'V', className: 'absent' },
  LATE: { label: 'Đi trễ', short: 'T', className: 'late' },
  EXCUSED: { label: 'Có phép', short: 'P', className: 'excused' },
  PENDING: { label: 'Chờ duyệt', short: '?', className: 'late' },
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

export default function TeacherDashboardPage({ user, onLogout }) {
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
    { key: 'classes', icon: <TeamOutlined />, label: 'Lớp phụ trách' },
    { key: 'schedule', icon: <CalendarOutlined />, label: 'Thời khóa biểu' },
    { key: 'attendance', icon: <CheckSquareOutlined />, label: 'Điểm danh' },
    { key: 'assignments', icon: <BookOutlined />, label: 'Bài tập' },
    { key: 'submissions', icon: <FileDoneOutlined />, label: 'Bài nộp' },
    { key: 'grading', icon: <FileDoneOutlined />, label: 'Chấm điểm' },
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Tổng kết' },
  ], []);

  const userName = user.username || 'teacher';
  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: userName },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: onLogout },
    ],
  };

  const showClassSelector = activeView !== 'overview';

  useEffect(() => {
    axiosClient.get('/api/schedules/me')
      .then((data) => setSchedules(Array.isArray(data) ? data : []))
      .catch(() => message.error('Không thể tải thời khóa biểu'));
  }, []);

  useEffect(() => {
    if (!workflow.selectedClassId) return;
    axiosClient.get(`/api/attendance/classes/${workflow.selectedClassId}`)
      .then((data) => setAttendanceRecords(Array.isArray(data) ? data : []))
      .catch(() => {
        if (activeView === 'attendance') message.error('Không thể tải dữ liệu điểm danh');
      });
  }, [activeView, workflow.selectedClassId]);

  const onTeacherMarkAttendance = async (studentId, status) => {
    try {
      const saved = await axiosClient.post('/api/attendance/teacher', {
        classId: workflow.selectedClassId,
        studentId,
        attendanceDate,
        status,
      });
      setAttendanceRecords((records) => {
        const next = records.filter((item) => item.id !== saved.id);
        return [saved, ...next];
      });
      message.success('Đã lưu điểm danh');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || error.response?.data || 'Lưu điểm danh thất bại');
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
                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<TeamOutlined />} />
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
              <Breadcrumb items={[{ title: 'Teacher' }, { title: pageTitles[activeView] }]} />
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
            {activeView === 'overview' && <TeacherOverview workflow={workflow} />}
            {activeView === 'classes' && <TeacherClasses workflow={workflow} />}
            {activeView === 'schedule' && <TeacherSchedule workflow={workflow} schedules={schedules} />}
            {activeView === 'attendance' && (
              <TeacherAttendance
                workflow={workflow}
                attendanceDate={attendanceDate}
                attendanceRecords={attendanceRecords}
                onAttendanceDateChange={setAttendanceDate}
                onTeacherMarkAttendance={onTeacherMarkAttendance}
              />
            )}
            {activeView === 'assignments' && <TeacherAssignments workflow={workflow} />}
            {activeView === 'submissions' && <TeacherSubmissions workflow={workflow} />}
            {activeView === 'grading' && <TeacherGrading workflow={workflow} />}
            {activeView === 'analytics' && <SummaryPanel workflow={workflow} />}
          </div>
        </Content>

        <Footer className="role-footer">EduSystem ©{new Date().getFullYear()} Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
}

function TeacherOverview({ workflow }) {
  return <TeacherDashboardOverview workflow={workflow} />;
}

function TeacherClasses({ workflow }) {
  return (
    <div className="workspace-grid teacher-grid">
      <section className="panel feature-classes">
        <div className="panel-heading">
          <h2>Danh sách lớp phụ trách</h2>
          <span>{workflow.classes.length} lớp</span>
        </div>
        <div className="compact-list">
          {workflow.classes.map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.courseCode || 'N/A'} - {item.courseTitle} | {item.courseCredits || 0} tín chỉ</span>
              <span>{item.semester || 'Học kỳ'} | {statusLabel(item.status)} | {item.studentCount ?? 0} sinh viên</span>
              <button type="button" onClick={() => workflow.setSelectedClassId(item.id)}>Chọn lớp</button>
            </article>
          ))}
          {workflow.classes.length === 0 && <p className="empty">Bạn chưa được phân công lớp nào.</p>}
        </div>
      </section>

      <section className="panel feature-students">
        <div className="panel-heading">
          <h2>Sinh viên trong lớp</h2>
          <span>{workflow.selectedClass?.name || 'Chọn lớp'}</span>
        </div>
        <div className="submission-table student-roster-table">
          <div className="table-head"><span>Mã SV</span><span>Họ tên</span><span>Email</span><span>Trạng thái</span><span></span></div>
          {workflow.classStudents.map((student) => (
            <div className="table-row" key={student.id}>
              <span>{student.username}</span>
              <span>{student.fullName || '-'}</span>
              <span>{student.email || '-'}</span>
              <span className={`badge ${student.status}`}>{student.status}</span>
              <span></span>
            </div>
          ))}
          {workflow.classStudents.length === 0 && <p className="empty">Lớp này chưa có sinh viên.</p>}
        </div>
      </section>
    </div>
  );
}

function TeacherSchedule({ workflow, schedules }) {
  const classes = workflow.classes.length ? workflow.classes.map((item) => item.name) : ['Toán 8', 'Toán 9', 'Toán 7'];
  const visibleSchedule = schedules.filter((slot) => classes.includes(slot.className) || workflow.classes.length === 0);

  return (
    <section className="panel wide feature-schedule">
      <div className="panel-heading">
        <h2>Thời khóa biểu tuần</h2>
        <span>{visibleSchedule.length} buổi dạy</span>
      </div>
      <div className="schedule-board">
        <div className="schedule-head">Lớp</div>
        {weekDays.map((day) => <div className="schedule-head" key={day}>{day}</div>)}
        {classes.map((className) => (
          <div className="schedule-row" key={className}>
            <div className="schedule-class">{className}</div>
            {weekDays.map((day) => {
              const slots = visibleSchedule.filter((slot) => slot.className === className && dayLabels[slot.dayOfWeek] === day);
              return (
                <div className="schedule-cell" key={`${className}-${day}`}>
                  {slots.map((slot) => (
                    <article className="schedule-slot" key={slot.id}>
                      <strong>{slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}</strong>
                      <span>{slot.subject || slot.courseTitle}</span>
                      <span>{slot.room || 'Chưa có phòng'}</span>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function TeacherAttendance({ workflow, attendanceDate, attendanceRecords, onAttendanceDateChange, onTeacherMarkAttendance }) {
  const className = workflow.selectedClass?.name || 'Toán 8';
  const recordMap = new Map(attendanceRecords
    .filter((item) => item.attendanceDate === attendanceDate)
    .map((item) => [item.studentId, item]));

  return (
    <section className="panel wide feature-attendance">
      <div className="panel-heading">
        <h2>Bảng điểm danh</h2>
        <span>{className}</span>
      </div>
      <div className="attendance-toolbar">
        <input type="date" value={attendanceDate} onChange={(event) => onAttendanceDateChange(event.target.value)} />
        <Button type="primary" icon={<CheckSquareOutlined />} onClick={() => workflow.classStudents.forEach((student) => onTeacherMarkAttendance(student.id, 'PRESENT'))}>
          Điểm danh nhanh
        </Button>
        <span>{workflow.classStudents.length} học sinh</span>
      </div>
      <div className="attendance-grid" style={{ gridTemplateColumns: '220px 150px 1fr' }}>
        <div className="attendance-head">Học sinh</div>
        <div className="attendance-head center">Trạng thái</div>
        <div className="attendance-head">Cập nhật</div>
        {workflow.classStudents.map((student) => (
          <Fragment key={student.id}>
            <div className="attendance-name" key={`${student.id}-name`}>
              <strong>{student.fullName || student.username}</strong>
              <span>{student.username}</span>
            </div>
            <div className={`attendance-total center ${attendanceMeta[recordMap.get(student.id)?.status]?.className || ''}`}>
              {attendanceMeta[recordMap.get(student.id)?.status]?.label || 'Chưa điểm danh'}
            </div>
            <Select
              placeholder="Chọn trạng thái"
              value={recordMap.get(student.id)?.status}
              onChange={(status) => onTeacherMarkAttendance(student.id, status)}
              options={Object.entries(attendanceMeta).map(([value, meta]) => ({ value, label: meta.label }))}
            />
          </Fragment>
        ))}
      </div>
      <div className="attendance-legend">
        {Object.values(attendanceMeta).map((item) => (
          <span key={item.className}><i className={`attendance-dot ${item.className}`} />{item.label}</span>
        ))}
      </div>
    </section>
  );
}

function TeacherAssignments({ workflow }) {
  // --- BỔ SUNG: State bật tắt Modal AI ---
  const [isAIModalVisible, setIsAIModalVisible] = useState(false);

  const {
    assignments,
    editingId,
    form,
    handleAssignmentChange,
    onAssignmentFileChange,
    onCancelEdit,
    onDeleteAssignment,
    onSelectAssignment,
    onStartEdit,
    onSubmitAssignmentForm,
    selectedAssignmentId,
    selectedClass,
  } = workflow;
  const classCompleted = selectedClass?.status === 'COMPLETED';

  return (
    <div className="workspace-grid teacher-grid">
      <section className="panel feature-assignment-create">
        <div className="panel-heading">
          <h2>{editingId ? 'Sửa bài tập' : 'Tạo bài tập'}</h2>
          
          {/* --- BỔ SUNG: Nhóm Nút hành động --- */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {editingId && <button type="button" className="ghost-button" onClick={onCancelEdit}>Hủy sửa</button>}
            
            {/* Nút gọi AI Generator (Chỉ hiện khi lớp chưa kết thúc) */}
            {!classCompleted && (
              <Button 
                type="default" 
                style={{ backgroundColor: '#ffffff', color: '#1677ff', borderColor: '#1677ff' }} 
                icon={<RobotOutlined />} 
                onClick={() => setIsAIModalVisible(true)}
              >
                Tạo bằng AI
              </Button>
            )}
          </div>
        </div>
        
        {classCompleted && <p className="notice">Lớp đã kết thúc, không thể tạo hoặc chỉnh sửa bài tập.</p>}
        <form className="assignment-form" onSubmit={onSubmitAssignmentForm}>
          <label>Loại bài
            <select name="assignmentKind" value={form.assignmentKind || 'REGULAR'} onChange={handleAssignmentChange} disabled={classCompleted}>
              <option value="REGULAR">Bài tập</option>
              <option value="MIDTERM">Giữa kỳ</option>
              <option value="FINAL">Cuối kỳ</option>
            </select>
          </label>
          <label>Tiêu đề<input name="title" value={form.title} onChange={handleAssignmentChange} required disabled={classCompleted} /></label>
          <label>Mô tả<textarea name="description" value={form.description} onChange={handleAssignmentChange} rows="4" disabled={classCompleted} /></label>
          <div className="form-row">
            <label>Hạn nộp<input name="dueDate" type="datetime-local" value={form.dueDate} onChange={handleAssignmentChange} disabled={classCompleted} /></label>
            <label>Điểm tối đa<input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore} onChange={handleAssignmentChange} disabled={classCompleted} /></label>
          </div>
          <label>File/link đề bài<input name="fileUrl" value={form.fileUrl} onChange={handleAssignmentChange} placeholder="https://..." disabled={classCompleted} /></label>
          <label>Upload file đề bài<input type="file" onChange={(event) => onAssignmentFileChange(event.target.files?.[0] || null)} disabled={classCompleted} /></label>
          <button className="primary-action" type="submit" disabled={classCompleted}>{editingId ? 'Lưu thay đổi' : 'Tạo bài tập'}</button>
        </form>
      </section>

      <section className="panel feature-assignments">
        <div className="panel-heading"><h2>Danh sách bài tập</h2><span>{assignments.length} bài</span></div>
        <AssignmentList
          assignments={assignments}
          selectedAssignmentId={selectedAssignmentId}
          onDeleteAssignment={classCompleted ? null : onDeleteAssignment}
          onSelectAssignment={onSelectAssignment}
          onStartEdit={classCompleted ? null : onStartEdit}
          showActions
        />
      </section>

      {/* --- BỔ SUNG: Render Modal AI --- */}
      <AIQuizGenerator 
        visible={isAIModalVisible} 
        onClose={() => setIsAIModalVisible(false)} 
      />

    </div>
  );
}

function TeacherSubmissions({ workflow }) {
  return (
    <div className="workspace-grid teacher-grid submissions-view">
      <section className="panel feature-assignments">
        <div className="panel-heading"><h2>Bài tập</h2><span>{workflow.assignments.length} bài</span></div>
        <AssignmentList
          assignments={workflow.assignments}
          selectedAssignmentId={workflow.selectedAssignmentId}
          onSelectAssignment={workflow.onSelectAssignment}
        />
      </section>
      <section className="panel feature-submissions">
        <div className="panel-heading">
          <h2>Danh sách bài nộp</h2>
          <span>{workflow.assignmentDetail?.assignment?.title || 'Chọn bài tập'}</span>
        </div>
        <SubmissionListTable workflow={workflow} />
      </section>
    </div>
  );
}

function TeacherGrading({ workflow }) {
  return (
    <div className="workspace-grid teacher-grid submissions-view">
      <section className="panel feature-assignments">
        <div className="panel-heading"><h2>Bài tập</h2><span>{workflow.assignments.length} bài</span></div>
        <AssignmentList
          assignments={workflow.assignments}
          selectedAssignmentId={workflow.selectedAssignmentId}
          onSelectAssignment={workflow.onSelectAssignment}
        />
      </section>
      <section className="panel feature-grading">
        <div className="panel-heading">
          <h2>Chấm điểm</h2>
          <span>{workflow.assignmentDetail?.assignment?.title || 'Chọn bài tập'}</span>
        </div>
        <SubmissionGradingTable workflow={workflow} />
      </section>
    </div>
  );
}

function AssignmentList({ assignments, selectedAssignmentId, onDeleteAssignment, onSelectAssignment, onStartEdit, showActions = false }) {
  return (
    <div className="assignment-list">
      {assignments.map((assignment) => {
        const kind = assignmentKindMeta(assignment);
        return (
          <article className={`assignment-item ${String(selectedAssignmentId) === String(assignment.id) ? 'selected' : ''}`} key={assignment.id}>
            <button type="button" className="assignment-main" onClick={() => onSelectAssignment(assignment.id)}>
              <strong><span className={`assignment-kind ${kind.className}`}>{kind.label}</span>{cleanAssignmentTitle(assignment.title)}</strong>
              <span>{formatDate(assignment.dueDate)} | {assignment.submissionCount || 0} bài nộp | Điểm {score(assignment.maxScore)}</span>
            </button>
            <div className="assignment-actions">
              {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tải đề</a>}
              {showActions && onStartEdit && <button type="button" onClick={() => onStartEdit(assignment)}>Sửa</button>}
              {showActions && onDeleteAssignment && (
                <button
                  type="button"
                  className="danger"
                  title="Xóa bài tập"
                  onClick={() => onDeleteAssignment(assignment.id)}
                >
                  Xóa
                </button>
              )}
            </div>
          </article>
        );
      })}
      {assignments.length === 0 && <p className="empty">Lớp này chưa có bài tập.</p>}
    </div>
  );
}

function SubmissionListTable({ workflow }) {
  const { assignmentDetail } = workflow;

  return (
    <div className="submission-table">
      <div className="table-head"><span>Sinh viên</span><span>Trạng thái</span><span>Điểm</span><span>File</span><span>Thời gian</span></div>
      {assignmentDetail?.submissions?.map((row) => (
        <div className="table-row" key={row.studentId}>
          <span>{row.studentName}</span>
          <span className={`badge ${row.submission?.status || 'missing'}`}>{row.submitted ? statusLabel(row.submission?.status) : 'Chưa nộp'}</span>
          <span>{row.submission?.score != null ? score(row.submission.score) : '-'}</span>
          <span>{row.submission?.fileUrl ? <a href={fileHref(row.submission.fileUrl)} target="_blank" rel="noreferrer">Tải bài</a> : '-'}</span>
          <span>{row.submission?.submittedAt ? formatDate(row.submission.submittedAt) : '-'}</span>
        </div>
      ))}
      {!assignmentDetail && <p className="empty">Chọn một bài tập để xem danh sách bài nộp.</p>}
    </div>
  );
}

function SubmissionGradingTable({ workflow }) {
  const { assignmentDetail, gradeForms, onGrade, updateGradeForm } = workflow;

  return (
    <div className="submission-table">
      <div className="table-head"><span>Sinh viên</span><span>Trạng thái</span><span>Điểm</span><span>Feedback</span><span></span></div>
      {assignmentDetail?.submissions?.map((row) => (
        <div className="table-row" key={row.studentId}>
          <span>{row.studentName}</span>
          <span className={`badge ${row.submission?.status || 'missing'}`}>{row.submitted ? statusLabel(row.submission?.status) : 'Chưa nộp'}</span>
          {row.submission ? (
            <>
              <input type="number" min="0" max={assignmentDetail.assignment?.maxScore || 10} step="0.5" value={gradeForms[row.submission.id]?.score ?? ''} onChange={(event) => updateGradeForm(row.submission.id, 'score', event.target.value)} />
              <input value={gradeForms[row.submission.id]?.feedback ?? ''} onChange={(event) => updateGradeForm(row.submission.id, 'feedback', event.target.value)} placeholder="Nhận xét" />
              <div className="row-actions">
                {row.submission.fileUrl && <a href={fileHref(row.submission.fileUrl)} target="_blank" rel="noreferrer">Tải bài</a>}
                <button type="button" onClick={() => onGrade(row.submission.id)}>Lưu điểm</button>
              </div>
            </>
          ) : (
            <><span>-</span><span>-</span><span></span></>
          )}
        </div>
      ))}
      {!assignmentDetail && <p className="empty">Chọn một bài tập để chấm điểm.</p>}
    </div>
  );
}

const averageCategoryScore = (scores) => {
  if (!scores.length) return null;
  return scores.reduce((total, item) => total + item, 0) / scores.length;
};

const weightedSummaryScore = ({ regular, midterm, final }) => (
  (regular ?? 0) * 0.2 + (midterm ?? 0) * 0.3 + (final ?? 0) * 0.5
);

const summaryRank = (total) => {
  if (total >= 8.5) return 'Giỏi';
  if (total >= 7) return 'Khá';
  if (total >= 5) return 'Đạt';
  return 'Chưa đạt';
};

function SummaryPanel({ workflow }) {
  const { assignments, classAnalytics, classStudents, dashboard, selectedClass } = workflow;
  const [assignmentDetails, setAssignmentDetails] = useState([]);

  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      if (!assignments.length) {
        setAssignmentDetails([]);
        return;
      }
      try {
        const details = await Promise.all(assignments.map((assignment) => axiosClient.get(`/api/assignments/${assignment.id}`)));
        if (active) setAssignmentDetails(details.filter(Boolean));
      } catch (error) {
        console.error(error);
        if (active) setAssignmentDetails([]);
      }
    };
    loadDetails();
    return () => {
      active = false;
    };
  }, [assignments]);

  const summaryRows = useMemo(() => {
    const students = classStudents.length ? classStudents : classAnalytics?.studentProgress || [];
    return students.map((student) => {
      const byKind = { regular: [], midterm: [], final: [] };

      assignmentDetails.forEach((detail) => {
        const kind = assignmentKindMeta(detail.assignment || detail).key;
        const maxScore = Number(detail.assignment?.maxScore || detail.maxScore || 10);
        const row = detail.submissions?.find((item) => String(item.studentId) === String(student.id || student.studentId));
        const rawScore = Number(row?.submission?.score ?? 0);
        const normalizedScore = maxScore > 0 ? (rawScore / maxScore) * 10 : rawScore;
        byKind[kind].push(normalizedScore);
      });

      const regular = averageCategoryScore(byKind.regular);
      const midterm = averageCategoryScore(byKind.midterm);
      const final = averageCategoryScore(byKind.final);
      const total = weightedSummaryScore({ regular, midterm, final });

      return {
        studentId: student.id || student.studentId,
        studentName: student.fullName || student.studentName || student.username,
        regular,
        midterm,
        final,
        total,
        rank: summaryRank(total),
      };
    });
  }, [assignmentDetails, classAnalytics, classStudents]);

  return (
    <section className="panel wide feature-analytics">
      <div className="panel-heading">
        <h2>Tổng kết</h2>
        <span>{selectedClass?.name || classAnalytics?.className || 'Lớp học'}</span>
      </div>
      <div className="metrics">
        <div><strong>{dashboard?.classCount ?? '-'}</strong><span>Lớp</span></div>
        <div><strong>{assignments.length}</strong><span>Bài kiểm tra</span></div>
        <div><strong>{classStudents.length || classAnalytics?.studentProgress?.length || 0}</strong><span>Sinh viên</span></div>
        <div><strong>{score(classAnalytics?.classAverage)}</strong><span>Điểm TB lớp</span></div>
      </div>
      <div className="summary-weight-note">
        <span>Bài tập 20%</span>
        <span>Giữa kỳ 30%</span>
        <span>Cuối kỳ 50%</span>
      </div>
      <div className="submission-table summary-table">
        <div className="table-head">
          <span>Sinh viên</span>
          <span>Bài tập 20%</span>
          <span>Giữa kỳ 30%</span>
          <span>Cuối kỳ 50%</span>
          <span>Tổng kết</span>
          <span>Xếp loại</span>
        </div>
        {summaryRows.map((row) => (
          <div className="table-row" key={row.studentId}>
            <span>{row.studentName}</span>
            <span>{row.regular == null ? '-' : score(row.regular)}</span>
            <span>{row.midterm == null ? '-' : score(row.midterm)}</span>
            <span>{row.final == null ? '-' : score(row.final)}</span>
            <span><strong>{score(row.total)}</strong></span>
            <span className={`badge ${row.total >= 5 ? 'SUBMITTED' : 'missing'}`}>{row.rank}</span>
          </div>
        ))}
        {summaryRows.length === 0 && <p className="empty">Chưa có dữ liệu sinh viên để tổng kết.</p>}
      </div>
    </section>
  );
}
