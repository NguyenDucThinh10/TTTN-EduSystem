import GradeTable from "../../../components/tables/GradeTable"; import PageTemplate from "../../PageTemplate";
export default function GradeManagementPage() { return <PageTemplate title="Quan ly diem" description="Nhap va cap nhat diem thanh phan."><GradeTable grades={[{ id: 1, student: "Le Van C", process: 8, midterm: 7, final: 8, total: 7.7 }]} /></PageTemplate>; }
