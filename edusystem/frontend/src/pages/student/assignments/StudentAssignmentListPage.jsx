import AssignmentTable from "../../../components/tables/AssignmentTable"; import PageTemplate from "../../PageTemplate";
export default function StudentAssignmentListPage() { return <PageTemplate title="Bài tập của tôi" description="Danh sách bài tập cần thực hiện."><AssignmentTable assignments={[{ id: 1, title: "Bài tập vòng lặp", deadline: "2026-08-10", status: "OPEN" }]} /></PageTemplate>; }
