import { ClipboardList, FileText, Gauge, GraduationCap, NotebookTabs } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/teacher", label: "Dashboard", icon: <Gauge size={18} />, end: true }, { to: "/teacher/classrooms", label: "Lop phu trach", icon: <GraduationCap size={18} /> }, { to: "/teacher/materials", label: "Tai lieu", icon: <FileText size={18} /> }, { to: "/teacher/assignments", label: "Bai tap", icon: <ClipboardList size={18} /> }, { to: "/teacher/grades", label: "Diem so", icon: <NotebookTabs size={18} /> }];
export default function TeacherLayout() {
  return <div className="dashboard-layout"><Sidebar title="Giang vien" items={items} /><div className="main-area"><Header title="Khong gian giang vien" /><Outlet /><Footer /></div></div>;
}
