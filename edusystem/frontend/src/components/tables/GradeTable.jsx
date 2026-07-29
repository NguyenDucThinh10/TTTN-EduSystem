import DataTable from "./DataTable";
export default function GradeTable({ grades = [] }) {
  return <DataTable data={grades} columns={[{ key: "student", label: "Sinh vien" }, { key: "process", label: "Qua trinh" }, { key: "midterm", label: "Giua ky" }, { key: "final", label: "Cuoi ky" }, { key: "total", label: "Tong ket" }]} />;
}
