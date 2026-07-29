import { BookOpenCheck, ClipboardList, Clock3, Trophy } from "lucide-react";
import GradeChart from "../../components/charts/GradeChart";
import ProgressChart from "../../components/charts/ProgressChart";
import SubmissionChart from "../../components/charts/SubmissionChart";
import PageTemplate from "../PageTemplate";

const kpis = [
  { label: "Lớp đang học", value: "6", note: "2 lớp có bài mới", icon: <BookOpenCheck size={22} /> },
  { label: "Bài tập cần nộp", value: "4", note: "1 bài sắp hết hạn", icon: <ClipboardList size={22} /> },
  { label: "Điểm hiện tại", value: "7.9", note: "Tăng 0.4 so với tháng trước", icon: <Trophy size={22} /> },
  { label: "Deadline gần nhất", value: "2 ngày", note: "Bài tập vòng lặp", icon: <Clock3 size={22} /> }
];

const tasks = [
  ["Nộp bài tập vòng lặp", "10/08/2026"],
  ["Đọc tài liệu chương 4", "CS101"],
  ["Xem phản hồi bài giữa kỳ", "SE302"],
  ["Hoàn thành quiz tuần 3", "Còn 2 ngày"]
];

export default function StudentDashboardPage() {
  return (
    <PageTemplate title="Dashboard sinh viên" description="Theo dõi lớp đang học, bài tập cần nộp, điểm số và tiến độ cá nhân.">
      <section className="grid grid-3">
        {kpis.map((item) => <div className="panel kpi-card" key={item.label}><span className="kpi-icon">{item.icon}</span><span className="muted">{item.label}</span><div className="stat-value">{item.value}</div><p className="muted">{item.note}</p></div>)}
      </section>
      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="panel"><h2 className="dashboard-section-title">Tiến độ cá nhân</h2><ProgressChart value={64} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Nộp bài đúng hạn</h2><SubmissionChart value={90} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Điểm trung bình</h2><GradeChart value={7.9} /></div>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2 className="dashboard-section-title">Việc cần làm</h2>
        <ul className="dashboard-list">{tasks.map(([name, value]) => <li key={name}><span>{name}</span><strong>{value}</strong></li>)}</ul>
      </section>
    </PageTemplate>
  );
}
