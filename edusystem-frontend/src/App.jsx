import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from './api/axiosClient';
import AdminDashboard from './components/AdminDashboard';
import AdminOverview from './components/AdminOverview';
import ClassManagement from './components/ClassManagement';
import CourseManagement from './components/CourseManagement';
import ProtectedRoute from './components/ProtectedRoute';
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
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const role = normalizeRole(localStorage.getItem('role') || storedUser?.role);
    const username = localStorage.getItem('username') || storedUser?.username;
    const fullName = localStorage.getItem('fullName') || storedUser?.fullName;

    if (!token || !role) {
      clearStoredAuth();
      return null;
    }

    const user = { ...storedUser, username, fullName, role };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
    if (username) localStorage.setItem('username', username);
    if (fullName) localStorage.setItem('fullName', fullName);
    return user;
  } catch {
    return null;
  }
}

const normalizeRole = (role) => String(role || '').replace(/^ROLE_/, '').toUpperCase();

const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('fullName');
  localStorage.removeItem('user');
};

const persistUser = (nextUser) => {
  const normalizedUser = { ...nextUser, role: normalizeRole(nextUser?.role) };
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  localStorage.setItem('role', normalizedUser.role);
  if (normalizedUser.username) localStorage.setItem('username', normalizedUser.username);
  if (normalizedUser.fullName) localStorage.setItem('fullName', normalizedUser.fullName);
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
    const token = localStorage.getItem('token');

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
