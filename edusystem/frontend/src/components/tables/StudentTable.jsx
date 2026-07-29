import DataTable from "./DataTable";
export default function StudentTable({ students = [] }) {
  return <DataTable data={students} columns={[{ key: "code", label: "Ma SV" }, { key: "fullName", label: "Ho ten" }, { key: "email", label: "Email" }, { key: "progress", label: "Tien do" }]} />;
}
