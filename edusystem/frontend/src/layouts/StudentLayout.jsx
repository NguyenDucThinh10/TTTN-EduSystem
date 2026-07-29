import { BarChart3, BookMarked, ClipboardCheck, Gauge } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/student", label: "Tổng quan", icon: <Gauge size={18} />, end: true }, { to: "/student/classrooms", label: "Lớp của tôi", icon: <BookMarked size={18} /> }, { to: "/student/assignments", label: "Bài tập", icon: <ClipboardCheck size={18} /> }, { to: "/student/grades", label: "Điểm & tiến độ", icon: <BarChart3 size={18} /> }];
export default function StudentLayout() {
  return <div className="dashboard-layout"><Sidebar title="Sinh viên" items={items} /><div className="main-area"><Header title="Không gian sinh viên" /><Outlet /><Footer /></div></div>;
}
