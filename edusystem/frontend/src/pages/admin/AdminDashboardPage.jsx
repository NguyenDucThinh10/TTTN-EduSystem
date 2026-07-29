import { BookOpen, ClipboardList, GraduationCap, UsersRound } from "lucide-react";
import GradeChart from "../../components/charts/GradeChart";
import ProgressChart from "../../components/charts/ProgressChart";
import SubmissionChart from "../../components/charts/SubmissionChart";
import PageTemplate from "../PageTemplate";

const kpis = [
  { label: "Tài khoản", value: "1,248", note: "1,102 sinh viên", icon: <UsersRound size={22} /> },
  { label: "Học phần", value: "42", note: "6 học phần mới", icon: <BookOpen size={22} /> },
  { label: "Lớp học phần", value: "86", note: "73 lớp đang học", icon: <GraduationCap size={22} /> },
  { label: "Bài tập", value: "312", note: "48 bài sắp hết hạn", icon: <ClipboardList size={22} /> }
];

const tasks = [
  ["Duyệt tài khoản giảng viên mới", "4 yêu cầu"],
  ["Kiểm tra lớp học sắp kết thúc", "12 lớp"],
  ["Xem báo cáo điểm bất thường", "7 cảnh báo"],
  ["Cập nhật học kỳ hiện hành", "HK1 2026-2027"]
];

export default function AdminDashboardPage() {
  return (
    <PageTemplate title="Dashboard Admin" description="Tổng quan người dùng, lớp học, bài tập và kết quả học tập.">
      <section className="grid grid-3">
        {kpis.map((item) => <div className="panel kpi-card" key={item.label}><span className="kpi-icon">{item.icon}</span><span className="muted">{item.label}</span><div className="stat-value">{item.value}</div><p className="muted">{item.note}</p></div>)}
      </section>
      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="panel"><h2 className="dashboard-section-title">Chất lượng điểm</h2><GradeChart value={7.4} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Tiến độ học tập</h2><ProgressChart value={76} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Nộp bài đúng hạn</h2><SubmissionChart value={88} /></div>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2 className="dashboard-section-title">Việc cần xử lý</h2>
        <ul className="dashboard-list">{tasks.map(([name, value]) => <li key={name}><span>{name}</span><strong>{value}</strong></li>)}</ul>
      </section>
    </PageTemplate>
  );
}
