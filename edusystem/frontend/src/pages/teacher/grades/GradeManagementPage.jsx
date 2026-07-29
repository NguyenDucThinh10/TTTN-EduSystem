import GradeTable from "../../../components/tables/GradeTable"; import PageTemplate from "../../PageTemplate";
export default function GradeManagementPage() { return <PageTemplate title="Quản lý điểm" description="Nhập và cập nhật điểm thành phần."><GradeTable grades={[{ id: 1, student: "Lê Văn C", process: 8, midterm: 7, final: 8, total: 7.7 }]} /></PageTemplate>; }
