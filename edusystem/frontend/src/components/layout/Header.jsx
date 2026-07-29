import { LogOut, UserRound } from "lucide-react";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
export default function Header({ title }) {
  const { user, logout } = useAuth();
  return <header className="topbar"><div><strong>{title}</strong><p>{user?.username || "Khách"}</p></div><div className="actions"><span className="user-pill"><UserRound size={16} /> {user?.role}</span><Button variant="ghost" onClick={logout}><LogOut size={16} /> Đăng xuất</Button></div></header>;
}
