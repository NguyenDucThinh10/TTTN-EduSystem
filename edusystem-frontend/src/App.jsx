import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from './api/axiosClient';
import AdminDashboard from './components/AdminDashboard';
import AdminOverview from './components/AdminOverview';
import ClassManagement from './components/ClassManagement';
import CourseManagement from './components/CourseManagement';
import ProtectedRoute from './components/ProtectedRoute';
import ScheduleManagement from './components/ScheduleManagement';
import TuitionManagement from './components/TuitionManagement';
import UserManagement from './components/UserManagement';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/home/AboutPage';
import ContactPage from './pages/home/ContactPage';
import CoursesPage from './pages/home/CoursesPage';
import HomePage from './pages/home/HomePage';
import NewsPage from './pages/home/NewsPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';

function readStoredUser() {
  try {
    const token = sessionStorage.getItem('token');
    const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    const role = normalizeRole(sessionStorage.getItem('role') || storedUser?.role);
    const username = sessionStorage.getItem('username') || storedUser?.username;
    const fullName = sessionStorage.getItem('fullName') || storedUser?.fullName;

    if (!token || !role) {
      clearStoredAuth();
      return null;
    }

    const user = { ...storedUser, username, fullName, role };
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', role);
    if (username) sessionStorage.setItem('username', username);
    if (fullName) sessionStorage.setItem('fullName', fullName);
    return user;
  } catch {
    return null;
  }
}

const normalizeRole = (role) => String(role || '').replace(/^ROLE_/, '').toUpperCase();

const clearStoredAuth = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('fullName');
  sessionStorage.removeItem('user');
};

const persistUser = (nextUser) => {
  const normalizedUser = { ...nextUser, role: normalizeRole(nextUser?.role) };
  sessionStorage.setItem('user', JSON.stringify(normalizedUser));
  sessionStorage.setItem('role', normalizedUser.role);
  if (normalizedUser.username) sessionStorage.setItem('username', normalizedUser.username);
  if (normalizedUser.fullName) sessionStorage.setItem('fullName', normalizedUser.fullName);
  return normalizedUser;
};

const roleHomePath = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'ADMIN') return '/admin';
  if (normalizedRole === 'TEACHER') return '/teacher';
  if (normalizedRole === 'STUDENT') return '/student';
  return '/';
};

function App() {
  const [user, setUser] = useState(readStoredUser());

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    let active = true;
    const token = sessionStorage.getItem('token');

    if (!token || !isAuthenticated) return undefined;

    axiosClient
      .get('/api/me')
      .then((profile) => {
        if (!active) return;
        const syncedUser = persistUser({
          id: profile.id,
          username: profile.username,
          fullName: profile.fullName,
          role: profile.role,
        });
        setUser(syncedUser);

        const expectedPath = roleHomePath(syncedUser.role);
        const isRoleDashboard = ['/admin', '/teacher', '/student'].some((path) => location.pathname.startsWith(path));
        if (isRoleDashboard && !location.pathname.startsWith(expectedPath)) {
          navigate(expectedPath, { replace: true });
        }
      })
      .catch(() => {
        if (!active) return;
        clearStoredAuth();
        setUser(null);
        navigate('/auth', { replace: true });
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, location.pathname, navigate, setUser]);

  const handleAuthenticated = (authUser) => {
    const normalizedUser = persistUser(authUser);
    setUser(normalizedUser);
    navigate(roleHomePath(normalizedUser.role), { replace: true });
  };

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
      <Route path="/gioi-thieu" element={<AboutPage user={user} onLogout={handleLogout} />} />
      <Route path="/khoa-hoc" element={<CoursesPage user={user} onLogout={handleLogout} />} />
      <Route path="/tin-tuc" element={<NewsPage user={user} onLogout={handleLogout} />} />
      <Route path="/lien-he" element={<ContactPage user={user} onLogout={handleLogout} />} />
      <Route
        path="/login"
        element={user ? <Navigate replace to={roleHomePath(user.role)} /> : <AuthPage onAuthenticated={handleAuthenticated} />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate replace to={roleHomePath(user.role)} /> : <AuthPage onAuthenticated={handleAuthenticated} />}
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="schedules" element={<ScheduleManagement />} />
        <Route path="tuitions" element={<TuitionManagement />} />
      </Route>
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <TeacherDashboardPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboardPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
