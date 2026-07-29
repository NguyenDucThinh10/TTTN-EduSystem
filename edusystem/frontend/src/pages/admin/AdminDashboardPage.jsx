import GradeChart from "../../components/charts/GradeChart";
import ProgressChart from "../../components/charts/ProgressChart";
import SubmissionChart from "../../components/charts/SubmissionChart";
import PageTemplate from "../PageTemplate";
export default function AdminDashboardPage() {
  return <PageTemplate title="Dashboard Admin" description="Tong quan lop hoc, sinh vien, bai tap va ket qua hoc tap."><section className="grid grid-3"><div className="panel"><span className="muted">Sinh vien</span><div className="stat-value">1,240</div></div><div className="panel"><span className="muted">Lop hoc phan</span><div className="stat-value">86</div></div><div className="panel"><span className="muted">Bai tap</span><div className="stat-value">312</div></div></section><section className="grid grid-3" style={{ marginTop: 16 }}><div className="panel"><GradeChart /></div><div className="panel"><ProgressChart /></div><div className="panel"><SubmissionChart /></div></section></PageTemplate>;
}
