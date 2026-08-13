import { useMemo, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme, Typography } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
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
const { Text } = Typography;

const pageTitles = {
  overview: 'Tổng quan',
  assignments: 'Bài tập của lớp',
  submissions: 'Bài đã nộp',
  grades: 'Điểm của tôi',
};

export default function StudentDashboardPage({ user, onLogout }) {
  const workflow = useDashboardWorkflow(user);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = useMemo(() => [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'assignments', icon: <ReadOutlined />, label: 'Bài tập của lớp' },
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

  const showClassSelector = activeView !== 'overview';

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
            <Breadcrumb items={[{ title: 'Student' }, { title: pageTitles[activeView] }]} />
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
  return (
    <section className="overview-panel">
      <p>Chào mừng đến trang sinh viên EduSystem.</p>
      <div className="overview-stats">
        <div><strong>{workflow.classes.length}</strong><span>Lớp đã ghi danh</span></div>
        <div><strong>{workflow.assignments.length}</strong><span>Bài tập trong lớp đang chọn</span></div>
        <div><strong>{workflow.mySubmissions.length}</strong><span>Bài đã nộp</span></div>
        <div><strong>{score(workflow.studentGrades?.averageScore)}</strong><span>Điểm trung bình</span></div>
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

  return (
    <section className="panel wide">
      <div className="panel-heading"><h2>Bài tập của lớp</h2><span>{selectedClass?.name || ''}</span></div>
      <div className="student-assignment-list">
        {assignments.map((assignment) => {
          const submission = submittedByAssignment[assignment.id];
          return (
            <article className="student-assignment" key={assignment.id}>
              <div>
                <h3>{assignment.title}</h3>
                <p>{assignment.description || 'Không có mô tả.'}</p>
                <span>Hạn nộp: {formatDate(assignment.dueDate)} | Điểm: {score(assignment.maxScore)}</span>
                {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tải đề bài</a>}
              </div>
              <div className="submit-box">
                {submission ? (
                  <>
                    <span className={`badge ${submission.status}`}>{statusLabel(submission.status)}</span>
                    <strong>{submission.score != null ? `${score(submission.score)} điểm` : 'Chưa chấm'}</strong>
                    {submission.fileUrl && <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">File đã nộp</a>}
                    <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                    <button type="button" onClick={() => onResubmit(assignment.id)} disabled={!uploadFiles[assignment.id]}>Nộp lại</button>
                    <button type="button" className="danger" onClick={() => onCancelSubmission(submission.id)}>Hủy nộp</button>
                  </>
                ) : (
                  <>
                    <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                    <button type="button" onClick={() => onUpload(assignment.id)} disabled={!uploadFiles[assignment.id]}>Nộp bài</button>
                  </>
                )}
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
            <span>{score(grade.score)} / {score(grade.maxScore)} | {grade.feedback || 'Chưa có nhận xét'}</span>
          </article>
        ))}
        {(!workflow.studentGrades?.grades || workflow.studentGrades.grades.length === 0) && <p className="empty">Chưa có điểm.</p>}
      </div>
    </section>
  );
}
