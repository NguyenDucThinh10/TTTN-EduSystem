import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function StudentProgressPage() { return <PageTemplate title="Bieu do tien do" description="Theo doi tien do hoc tap theo tung lop va bai tap."><section className="panel"><ProgressChart value={64} /></section></PageTemplate>; }
