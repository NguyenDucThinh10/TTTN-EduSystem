import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (payload) => {
    setLoading(true); setError("");
    try { const user = await login(payload); navigate(user.role === ROLES.ADMIN ? "/admin" : user.role === ROLES.TEACHER ? "/teacher" : "/student"); }
    catch { setError("Đăng nhập thất bại. Kiểm tra lại tài khoản và mật khẩu."); }
    finally { setLoading(false); }
  };
  return <><h1>Đăng nhập</h1><p className="muted">Quản lý lớp học, bài tập, điểm số và tiến độ học tập.</p>{error && <p className="field-error">{error}</p>}<LoginForm onSubmit={handleSubmit} loading={loading} /><p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p></>;
}
