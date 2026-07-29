import { ClipboardList, FileText, Gauge, GraduationCap, NotebookTabs } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/teacher", label: "Tổng quan", icon: <Gauge size={18} />, end: true }, { to: "/teacher/classrooms", label: "Lớp phụ trách", icon: <GraduationCap size={18} /> }, { to: "/teacher/materials", label: "Tài liệu", icon: <FileText size={18} /> }, { to: "/teacher/assignments", label: "Bài tập", icon: <ClipboardList size={18} /> }, { to: "/teacher/grades", label: "Điểm số", icon: <NotebookTabs size={18} /> }];
export default function TeacherLayout() {
  return <div className="dashboard-layout"><Sidebar title="Giảng viên" items={items} /><div className="main-area"><Header title="Không gian giảng viên" /><Outlet /><Footer /></div></div>;
}
