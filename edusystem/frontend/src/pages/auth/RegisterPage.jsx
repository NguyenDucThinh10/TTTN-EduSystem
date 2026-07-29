import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ confirmPassword, ...payload }) => {
    if (payload.password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const user = await register(payload);
      navigate(user.role === ROLES.ADMIN ? "/admin" : user.role === ROLES.TEACHER ? "/teacher" : "/student");
    } catch {
      setError("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Đăng ký</h1>
      <p className="muted">Tạo tài khoản EduLMS để truy cập lớp học và bảng điểm.</p>
      {error && <p className="field-error">{error}</p>}
      <RegisterForm onSubmit={handleSubmit} loading={loading} />
      <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </>
  );
}
