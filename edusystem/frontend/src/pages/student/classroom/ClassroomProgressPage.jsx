import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function ClassroomProgressPage() { return <PageTemplate title="Tien do hoc tap ca nhan" description="Theo doi muc do hoan thanh trong lop."><section className="panel"><ProgressChart value={64} /></section></PageTemplate>; }
