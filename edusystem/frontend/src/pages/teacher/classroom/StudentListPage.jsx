import StudentTable from "../../../components/tables/StudentTable"; import PageTemplate from "../../PageTemplate";
export default function StudentListPage() { return <PageTemplate title="Danh sach sinh vien" description="Sinh vien trong lop hoc phan."><StudentTable students={[{ id: 1, code: "SV001", fullName: "Le Van C", email: "student@edulms.local", progress: "72%" }]} /></PageTemplate>; }
