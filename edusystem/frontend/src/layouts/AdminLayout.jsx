import { BookOpen, FileBarChart, GraduationCap, LayoutDashboard, UsersRound } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true }, { to: "/admin/users", label: "Tai khoan", icon: <UsersRound size={18} /> }, { to: "/admin/courses", label: "Hoc phan", icon: <BookOpen size={18} /> }, { to: "/admin/classrooms", label: "Lop hoc", icon: <GraduationCap size={18} /> }, { to: "/admin/reports", label: "Bao cao", icon: <FileBarChart size={18} /> }];
export default function AdminLayout() {
  return <div className="dashboard-layout"><Sidebar title="Admin" items={items} /><div className="main-area"><Header title="Quan tri he thong" /><Outlet /><Footer /></div></div>;
}
