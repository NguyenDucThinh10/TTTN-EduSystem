import { Link, NavLink } from 'react-router-dom';
import { navItems } from './homeContent';
import './HomePages.css';

const roleHomePath = (role) => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TEACHER') return '/teacher';
  if (role === 'STUDENT') return '/student';
  return '/login';
};

export default function HomeLayout({ children, user, onLogout }) {
  return (
    <div className="home-shell">
      <header className="home-header">
        <Link className="home-brand" to="/">
          <span className="home-brand-mark">E</span>
          <span>EduLMS</span>
        </Link>

        <nav className="home-nav" aria-label="Điều hướng trang chủ">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'home-nav-link active' : 'home-nav-link')}
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="home-actions">
            <Link className="home-secondary-action" to={roleHomePath(user.role)}>
              Vào hệ thống
            </Link>
            <button className="home-primary-action" onClick={onLogout} type="button">
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link className="home-primary-action" to="/login">
            Đăng nhập
          </Link>
        )}
      </header>

      {children}

      <footer className="home-footer">
        <div>
          <h2>EduLMS</h2>
          <p>Cổng thông tin học tập, quản lý bài tập, nộp bài và điểm số cho giảng viên và sinh viên.</p>
        </div>
        <div className="home-footer-links">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
