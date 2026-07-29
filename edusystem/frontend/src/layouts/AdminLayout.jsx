import { BookOpen, FileBarChart, GraduationCap, LayoutDashboard, UsersRound } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/admin", label: "Tổng quan", icon: <LayoutDashboard size={18} />, end: true }, { to: "/admin/users", label: "Tài khoản", icon: <UsersRound size={18} /> }, { to: "/admin/courses", label: "Học phần", icon: <BookOpen size={18} /> }, { to: "/admin/classrooms", label: "Lớp học", icon: <GraduationCap size={18} /> }, { to: "/admin/reports", label: "Báo cáo", icon: <FileBarChart size={18} /> }];
export default function AdminLayout() {
  return <div className="dashboard-layout"><Sidebar title="Admin" items={items} /><div className="main-area"><Header title="Quản trị hệ thống" /><Outlet /><Footer /></div></div>;
}
