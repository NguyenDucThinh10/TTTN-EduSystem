import { BookMarked, ClipboardCheck, Clock3, UsersRound } from "lucide-react";
import GradeChart from "../../components/charts/GradeChart";
import ProgressChart from "../../components/charts/ProgressChart";
import SubmissionChart from "../../components/charts/SubmissionChart";
import PageTemplate from "../PageTemplate";

const kpis = [
  { label: "Lớp phụ trách", value: "5", note: "3 lớp đang học", icon: <BookMarked size={22} /> },
  { label: "Sinh viên", value: "218", note: "17 sinh viên cần hỗ trợ", icon: <UsersRound size={22} /> },
  { label: "Bài nộp mới", value: "64", note: "Cần chấm trong tuần", icon: <ClipboardCheck size={22} /> },
  { label: "Sắp hết hạn", value: "9", note: "Bài tập trong 3 ngày", icon: <Clock3 size={22} /> }
];

const tasks = [
  ["Chấm bài tập vòng lặp", "28 bài"],
  ["Phản hồi sinh viên vắng quá nhiều", "6 sinh viên"],
  ["Đăng tài liệu chương 4", "CS101-01"],
  ["Công bố điểm giữa kỳ", "SE302-02"]
];

export default function TeacherDashboardPage() {
  return (
    <PageTemplate title="Dashboard giảng viên" description="Theo dõi lớp phụ trách, bài nộp, điểm số và tiến độ.">
      <section className="grid grid-3">
        {kpis.map((item) => <div className="panel kpi-card" key={item.label}><span className="kpi-icon">{item.icon}</span><span className="muted">{item.label}</span><div className="stat-value">{item.value}</div><p className="muted">{item.note}</p></div>)}
      </section>
      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="panel"><h2 className="dashboard-section-title">Tiến độ lớp</h2><ProgressChart value={71} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Tỷ lệ nộp bài</h2><SubmissionChart value={82} /></div>
        <div className="panel"><h2 className="dashboard-section-title">Điểm trung bình</h2><GradeChart value={7.6} /></div>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2 className="dashboard-section-title">Cần xử lý hôm nay</h2>
        <ul className="dashboard-list">{tasks.map(([name, value]) => <li key={name}><span>{name}</span><strong>{value}</strong></li>)}</ul>
      </section>
    </PageTemplate>
  );
}
