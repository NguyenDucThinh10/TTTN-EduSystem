import DataTable from "./DataTable";
export default function GradeTable({ grades = [] }) {
  return <DataTable data={grades} columns={[{ key: "student", label: "Sinh viên" }, { key: "process", label: "Quá trình" }, { key: "midterm", label: "Giữa kỳ" }, { key: "final", label: "Cuối kỳ" }, { key: "total", label: "Tổng kết" }]} />;
}
