import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function ClassroomProgressPage() { return <PageTemplate title="Tiến độ học tập của lớp" description="Theo dõi mức độ hoàn thành của sinh viên."><section className="panel"><ProgressChart value={69} /></section></PageTemplate>; }
