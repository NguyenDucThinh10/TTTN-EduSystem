import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import './AuthPage.css';

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((current) => ({ ...current, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((current) => ({ ...current, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axiosClient.post('/api/auth/login', loginData);
      localStorage.setItem('token', response.accessToken);
      const profile = await axiosClient.get('/api/me');
      const authUser = {
        id: profile.id,
        username: profile.username || response.username,
        fullName: profile.fullName,
        role: profile.role || response.role,
        tokenType: response.tokenType,
      };
      localStorage.setItem('user', JSON.stringify(authUser));
      onAuthenticated(authUser);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Dang nhap that bai. Kiem tra lai tai khoan va mat khau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosClient.post('/api/auth/register', registerData);
      setRegisterData({ fullName: '', username: '', email: '', password: '' });
      setMode('login');
      setMessage('Dang ky thanh cong. Ban co the dang nhap ngay.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data || 'Dang ky that bai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand">
          <span className="brand-mark">E</span>
          <div>
            <h1>EduSystem</h1>
            <p>Phan B: bai tap, nop bai, cham diem va thong ke.</p>
          </div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Auth mode">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">
            Dang nhap
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">
            Dang ky SV
          </button>
        </div>

        {message && <div className="auth-message">{message}</div>}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              Username
              <input name="username" value={loginData.username} onChange={handleLoginChange} required autoComplete="username" />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                autoComplete="current-password"
              />
            </label>
            <button className="primary-action" type="submit" disabled={loading}>
              {loading ? 'Dang xu ly...' : 'Dang nhap'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label>
              Ho va ten
              <input name="fullName" value={registerData.fullName} onChange={handleRegisterChange} required />
            </label>
            <label>
              Username
              <input name="username" value={registerData.username} onChange={handleRegisterChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} required />
            </label>
            <label>
              Password
              <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} required />
            </label>
            <button className="primary-action" type="submit" disabled={loading}>
              {loading ? 'Dang xu ly...' : 'Tao tai khoan'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
