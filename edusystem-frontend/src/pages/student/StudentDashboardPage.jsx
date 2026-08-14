import { useMemo, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ClassSelectorPanel from '../../components/ClassSelectorPanel';
import useDashboardWorkflow from '../../hooks/useDashboardWorkflow';
import { fileHref, formatDate, score, statusLabel } from '../../utils/dashboardDisplay';
import '../../styles/roleDashboard.css';
import './StudentDashboard.css';

const { Header, Sider, Content, Footer } = Layout;

const pageTitles = {
  overview: 'Tổng quan',
  registration: 'Đăng ký học phần',
  classes: 'Lớp của tôi',
  assignments: 'Bài tập',
  submissions: 'Bài đã nộp',
  grades: 'Điểm của tôi',
};

const isPastDue = (dueDate) => dueDate && new Date(dueDate).getTime() < Date.now();

export default function StudentDashboardPage({ user, onLogout }) {
  const workflow = useDashboardWorkflow(user);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = useMemo(() => [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'registration', icon: <BookOutlined />, label: 'Đăng ký học phần' },
    { key: 'classes', icon: <ReadOutlined />, label: 'Lớp của tôi' },
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

  const showClassSelector = ['assignments', 'submissions', 'grades'].includes(activeView);

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
              <Button onClick={workflow.onRefresh} loading={workflow.loading}>Làm mới</Button>
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
  const submittedIds = new Set(workflow.mySubmissions.map((item) => item.assignmentId));
  const missingCount = workflow.assignments.filter((item) => !submittedIds.has(item.id)).length;

  return (
    <section className="overview-panel">
      <p>Chào mừng đến trang sinh viên EduSystem.</p>
      <div className="overview-stats">
        <div><strong>{workflow.classes.length}</strong><span>Lớp đã đăng ký</span></div>
        <div><strong>{workflow.assignments.length}</strong><span>Bài tập lớp đang chọn</span></div>
        <div><strong>{workflow.mySubmissions.length}</strong><span>Bài đã nộp</span></div>
        <div><strong>{missingCount}</strong><span>Bài chưa nộp</span></div>
        <div><strong>{score(workflow.studentGrades?.averageScore)}</strong><span>Điểm trung bình</span></div>
      </div>
    </section>
  );
}

function CourseRegistration({ workflow }) {
  return (
    <section className="panel wide">
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
              <button type="button" onClick={() => workflow.onRegisterClass(classItem.id)} disabled={classItem.enrolled}>
                {classItem.enrolled ? 'Đã đăng ký' : 'Đăng ký'}
              </button>
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
    <section className="panel wide">
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
              <button type="button" onClick={() => workflow.setSelectedClassId(classItem.id)}>Chọn lớp</button>
              <button type="button" className="danger" onClick={() => workflow.onCancelRegistration(classItem.id)}>Hủy đăng ký</button>
            </div>
          </article>
        ))}
        {workflow.classes.length === 0 && <p className="empty">Bạn chưa đăng ký lớp nào.</p>}
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
    <section className="panel wide">
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
    <section className="panel wide">
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
    <section className="panel wide">
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
