import { Outlet } from "react-router-dom";
export default function AuthLayout() {
  return <div className="auth-layout"><section className="auth-panel"><div className="brand"><span className="brand-mark">EL</span><strong>EduLMS</strong></div><Outlet /></section></div>;
}
