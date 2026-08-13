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
import LearningPage from './pages/learning/LearningPage';

function readStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!token || !storedUser?.role) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      return null;
    }
    return storedUser;
  } catch {
    return null;
  }
}

const roleHomePath = (role) => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TEACHER' || role === 'STUDENT') return '/learning';
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
    setUser(authUser);
    navigate(roleHomePath(authUser.role), { replace: true });
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
        path="/learning"
        element={user ? <LearningPage user={user} onLogout={handleLogout} /> : <Navigate replace to="/login" />}
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
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
            <LearningPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <LearningPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
