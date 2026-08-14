import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import ClassManagement from './components/ClassManagement';
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
    const role = normalizeRole(storedUser?.role || localStorage.getItem('role'));
    const username = storedUser?.username || localStorage.getItem('username');

    if (!token || !role) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      return null;
    }

    const user = { ...storedUser, username, role };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
    if (username) localStorage.setItem('username', username);
    return user;
  } catch {
    return null;
  }
}

const normalizeRole = (role) => String(role || '').replace(/^ROLE_/, '').toUpperCase();

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

  const handleAuthenticated = (authUser) => {
    const normalizedUser = { ...authUser, role: normalizeRole(authUser?.role) };
    setUser(normalizedUser);
    navigate(roleHomePath(normalizedUser.role), { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
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
        <Route index element={<div>Chao mung den trang quan tri EduSystem.</div>} />
        <Route path="users" element={<UserManagement />} />
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
