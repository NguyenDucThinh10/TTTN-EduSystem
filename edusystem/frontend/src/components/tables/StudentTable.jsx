import DataTable from "./DataTable";
export default function StudentTable({ students = [] }) {
  return <DataTable data={students} columns={[{ key: "code", label: "Mã SV" }, { key: "fullName", label: "Họ tên" }, { key: "email", label: "Email" }, { key: "progress", label: "Tiến độ" }]} />;
}
