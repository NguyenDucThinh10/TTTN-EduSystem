import { BarChart3, BookMarked, ClipboardCheck, Gauge } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
const items = [{ to: "/student", label: "Dashboard", icon: <Gauge size={18} />, end: true }, { to: "/student/classrooms", label: "Lop cua toi", icon: <BookMarked size={18} /> }, { to: "/student/assignments", label: "Bai tap", icon: <ClipboardCheck size={18} /> }, { to: "/student/grades", label: "Diem & tien do", icon: <BarChart3 size={18} /> }];
export default function StudentLayout() {
  return <div className="dashboard-layout"><Sidebar title="Sinh vien" items={items} /><div className="main-area"><Header title="Khong gian sinh vien" /><Outlet /><Footer /></div></div>;
}
