import GradeTable from "../../../components/tables/GradeTable"; import PageTemplate from "../../PageTemplate";
export default function StudentGradePage() { return <PageTemplate title="Điểm thành phần" description="Xem điểm quá trình, giữa kỳ, cuối kỳ và tổng kết."><GradeTable grades={[{ id: 1, student: "Lê Văn C", process: 8, midterm: 7, final: 8, total: 7.7 }]} /></PageTemplate>; }
