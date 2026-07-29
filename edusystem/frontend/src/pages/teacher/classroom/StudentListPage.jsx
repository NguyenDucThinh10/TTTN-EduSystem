import StudentTable from "../../../components/tables/StudentTable"; import PageTemplate from "../../PageTemplate";
export default function StudentListPage() { return <PageTemplate title="Danh sách sinh viên" description="Sinh viên trong lớp học phần."><StudentTable students={[{ id: 1, code: "SV001", fullName: "Lê Văn C", email: "student@edulms.local", progress: "72%" }]} /></PageTemplate>; }
