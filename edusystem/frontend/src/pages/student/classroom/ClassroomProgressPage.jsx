import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function ClassroomProgressPage() { return <PageTemplate title="Tiến độ học tập cá nhân" description="Theo dõi mức độ hoàn thành trong lớp."><section className="panel"><ProgressChart value={64} /></section></PageTemplate>; }
