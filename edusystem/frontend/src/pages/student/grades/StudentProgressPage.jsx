import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function StudentProgressPage() { return <PageTemplate title="Biểu đồ tiến độ" description="Theo dõi tiến độ học tập theo từng lớp và bài tập."><section className="panel"><ProgressChart value={64} /></section></PageTemplate>; }
