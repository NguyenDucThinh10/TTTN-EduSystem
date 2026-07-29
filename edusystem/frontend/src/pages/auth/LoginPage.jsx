import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    catch { setError("Dang nhap that bai. Kiem tra lai tai khoan va mat khau."); }
    finally { setLoading(false); }
  };
  return <><h1>Dang nhap</h1><p className="muted">Quan ly lop hoc, bai tap, diem so va tien do hoc tap.</p>{error && <p className="field-error">{error}</p>}<LoginForm onSubmit={handleSubmit} loading={loading} /></>;
}
