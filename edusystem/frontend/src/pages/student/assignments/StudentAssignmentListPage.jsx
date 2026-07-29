import AssignmentTable from "../../../components/tables/AssignmentTable"; import PageTemplate from "../../PageTemplate";
export default function StudentAssignmentListPage() { return <PageTemplate title="Bai tap cua toi" description="Danh sach bai tap can thuc hien."><AssignmentTable assignments={[{ id: 1, title: "Bai tap vong lap", deadline: "2026-08-10", status: "OPEN" }]} /></PageTemplate>; }
