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
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ClassSelectorPanel from '../../components/ClassSelectorPanel';
import useDashboardWorkflow from '../../hooks/useDashboardWorkflow';
import { fileHref, formatDate, score, statusLabel } from '../../utils/dashboardDisplay';
import '../../styles/roleDashboard.css';
import './TeacherDashboard.css';

const { Header, Sider, Content, Footer } = Layout;

const pageTitles = {
  overview: 'Tổng quan',
  assignments: 'Bài tập',
  submissions: 'Chấm điểm',
  analytics: 'Thống kê',
};

export default function TeacherDashboardPage({ user, onLogout }) {
  const workflow = useDashboardWorkflow(user);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = useMemo(() => [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'assignments', icon: <BookOutlined />, label: 'Bài tập' },
    { key: 'submissions', icon: <FileDoneOutlined />, label: 'Chấm điểm' },
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Thống kê' },
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
            <Breadcrumb items={[{ title: 'Teacher' }, { title: pageTitles[activeView] }]} />
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
            {activeView === 'assignments' && <TeacherAssignments workflow={workflow} />}
            {activeView === 'submissions' && <TeacherSubmissions workflow={workflow} />}
            {activeView === 'analytics' && <AnalyticsPanel classAnalytics={workflow.classAnalytics} dashboard={workflow.dashboard} />}
          </div>
        </Content>

        <Footer className="role-footer">EduSystem ©{new Date().getFullYear()} Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
}

function TeacherOverview({ workflow }) {
  return (
    <section className="overview-panel">
      <p>Chào mừng đến trang giảng viên EduSystem.</p>
      <div className="overview-stats">
        <div><strong>{workflow.classes.length}</strong><span>Lớp phụ trách</span></div>
        <div><strong>{workflow.assignments.length}</strong><span>Bài tập trong lớp đang chọn</span></div>
        <div><strong>{workflow.dashboard?.submissionCount ?? '-'}</strong><span>Bài nộp</span></div>
        <div><strong>{score(workflow.classAnalytics?.classAverage)}</strong><span>Điểm TB lớp</span></div>
      </div>
    </section>
  );
}

function TeacherAssignments({ workflow }) {
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
  } = workflow;

  return (
    <div className="workspace-grid teacher-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>{editingId ? 'Sửa bài tập' : 'Tạo bài tập'}</h2>
          {editingId && <button type="button" className="ghost-button" onClick={onCancelEdit}>Hủy sửa</button>}
        </div>
        <form className="assignment-form" onSubmit={onSubmitAssignmentForm}>
          <label>Tiêu đề<input name="title" value={form.title} onChange={handleAssignmentChange} required /></label>
          <label>Mô tả<textarea name="description" value={form.description} onChange={handleAssignmentChange} rows="4" /></label>
          <div className="form-row">
            <label>Hạn nộp<input name="dueDate" type="datetime-local" value={form.dueDate} onChange={handleAssignmentChange} /></label>
            <label>Điểm tối đa<input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore} onChange={handleAssignmentChange} /></label>
          </div>
          <label>File/link đề bài<input name="fileUrl" value={form.fileUrl} onChange={handleAssignmentChange} placeholder="https://..." /></label>
          <label>Upload file đề bài<input type="file" onChange={(event) => onAssignmentFileChange(event.target.files?.[0] || null)} /></label>
          <button className="primary-action" type="submit">{editingId ? 'Lưu thay đổi' : 'Tạo bài tập'}</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Danh sách bài tập</h2><span>{assignments.length} bài</span></div>
        <AssignmentList
          assignments={assignments}
          selectedAssignmentId={selectedAssignmentId}
          onDeleteAssignment={onDeleteAssignment}
          onSelectAssignment={onSelectAssignment}
          onStartEdit={onStartEdit}
        />
      </section>
    </div>
  );
}

function TeacherSubmissions({ workflow }) {
  return (
    <div className="workspace-grid teacher-grid submissions-view">
      <section className="panel">
        <div className="panel-heading"><h2>Bài tập</h2><span>{workflow.assignments.length} bài</span></div>
        <AssignmentList
          assignments={workflow.assignments}
          selectedAssignmentId={workflow.selectedAssignmentId}
          onDeleteAssignment={workflow.onDeleteAssignment}
          onSelectAssignment={workflow.onSelectAssignment}
          onStartEdit={workflow.onStartEdit}
        />
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Bài nộp và chấm điểm</h2>
          <span>{workflow.assignmentDetail?.assignment?.title || 'Chọn bài tập'}</span>
        </div>
        <SubmissionGradingTable workflow={workflow} />
      </section>
    </div>
  );
}

function AssignmentList({ assignments, selectedAssignmentId, onDeleteAssignment, onSelectAssignment, onStartEdit }) {
  return (
    <div className="assignment-list">
      {assignments.map((assignment) => (
        <article className={`assignment-item ${String(selectedAssignmentId) === String(assignment.id) ? 'selected' : ''}`} key={assignment.id}>
          <button type="button" className="assignment-main" onClick={() => onSelectAssignment(assignment.id)}>
            <strong>{assignment.title}</strong>
            <span>{formatDate(assignment.dueDate)} | {assignment.submissionCount || 0} bài nộp</span>
          </button>
          <div className="assignment-actions">
            {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tải đề</a>}
            <button type="button" onClick={() => onStartEdit(assignment)}>Sửa</button>
            <button type="button" className="danger" onClick={() => onDeleteAssignment(assignment.id)}>Xóa</button>
          </div>
        </article>
      ))}
      {assignments.length === 0 && <p className="empty">Lớp này chưa có bài tập.</p>}
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
              <input type="number" min="0" step="0.5" value={gradeForms[row.submission.id]?.score ?? ''} onChange={(event) => updateGradeForm(row.submission.id, 'score', event.target.value)} />
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
      {!assignmentDetail && <p className="empty">Chọn một bài tập để xem danh sách nộp bài.</p>}
    </div>
  );
}

function AnalyticsPanel({ classAnalytics, dashboard }) {
  return (
    <section className="panel wide">
      <div className="panel-heading">
        <h2>Thống kê</h2>
        <span>{classAnalytics?.className || 'Lớp học'}</span>
      </div>
      <div className="metrics">
        <div><strong>{dashboard?.classCount ?? '-'}</strong><span>Lớp</span></div>
        <div><strong>{dashboard?.assignmentCount ?? '-'}</strong><span>Bài tập</span></div>
        <div><strong>{dashboard?.submissionCount ?? '-'}</strong><span>Bài nộp</span></div>
        <div><strong>{score(classAnalytics?.classAverage)}</strong><span>Điểm TB lớp</span></div>
      </div>
      <div className="analytics-columns">
        <div>
          <h3>Tiến độ sinh viên</h3>
          <div className="compact-list">
            {classAnalytics?.studentProgress?.map((item) => (
              <article key={item.studentId}>
                <strong>{item.studentName}</strong>
                <span>{item.submittedAssignments}/{item.totalAssignments} bài | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h3>Thống kê bài tập</h3>
          <div className="compact-list">
            {classAnalytics?.assignmentStatistics?.map((item) => (
              <article key={item.assignmentId}>
                <strong>{item.assignmentTitle}</strong>
                <span>{item.submissionCount} nộp | {item.gradedCount} chấm | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
