import { Link, NavLink } from 'react-router-dom';
import { navItems } from './homeContent';
import './HomePages.css';

export default function HomeLayout({ children, user, onLogout }) {
  return (
    <div className="home-shell">
      <header className="home-header">
        <Link className="home-brand" to="/">
          <span className="home-brand-mark">E</span>
          <span>EduLMS</span>
        </Link>

        <nav className="home-nav" aria-label="Dieu huong trang chu">
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
            <Link className="home-secondary-action" to="/learning">
              Vao he thong
            </Link>
            <button className="home-primary-action" onClick={onLogout} type="button">
              Dang xuat
            </button>
          </div>
        ) : (
          <Link className="home-primary-action" to="/login">
            Dang nhap
          </Link>
        )}
      </header>

      {children}

      <footer className="home-footer">
        <div>
          <h2>EduLMS</h2>
          <p>Cong thong tin hoc tap, quan ly bai tap, nop bai va diem so cho giang vien va sinh vien.</p>
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
