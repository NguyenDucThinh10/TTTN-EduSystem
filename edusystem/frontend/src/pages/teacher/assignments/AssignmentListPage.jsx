import AssignmentTable from "../../../components/tables/AssignmentTable"; import PageTemplate from "../../PageTemplate";
export default function AssignmentListPage() { return <PageTemplate title="Danh sach bai tap" description="Quan ly bai tap va han nop."><AssignmentTable assignments={[{ id: 1, title: "Bai tap vong lap", deadline: "2026-08-10", status: "OPEN" }]} /></PageTemplate>; }
