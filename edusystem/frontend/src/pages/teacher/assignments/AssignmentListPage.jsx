import AssignmentTable from "../../../components/tables/AssignmentTable"; import PageTemplate from "../../PageTemplate";
export default function AssignmentListPage() { return <PageTemplate title="Danh sách bài tập" description="Quản lý bài tập và hạn nộp."><AssignmentTable assignments={[{ id: 1, title: "Bài tập vòng lặp", deadline: "2026-08-10", status: "OPEN" }]} /></PageTemplate>; }
