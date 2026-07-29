import GradeTable from "../../../components/tables/GradeTable"; import PageTemplate from "../../PageTemplate";
export default function StudentGradePage() { return <PageTemplate title="Diem thanh phan" description="Xem diem qua trinh, giua ky, cuoi ky va tong ket."><GradeTable grades={[{ id: 1, student: "Le Van C", process: 8, midterm: 7, final: 8, total: 7.7 }]} /></PageTemplate>; }
