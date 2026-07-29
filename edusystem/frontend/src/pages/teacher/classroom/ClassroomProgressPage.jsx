import ProgressChart from "../../../components/charts/ProgressChart"; import PageTemplate from "../../PageTemplate";
export default function ClassroomProgressPage() { return <PageTemplate title="Tien do hoc tap cua lop" description="Theo doi muc do hoan thanh cua sinh vien."><section className="panel"><ProgressChart value={69} /></section></PageTemplate>; }
