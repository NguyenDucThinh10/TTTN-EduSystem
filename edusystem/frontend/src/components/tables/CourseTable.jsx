import DataTable from "./DataTable";
export default function CourseTable({ courses = [] }) {
  return <DataTable data={courses} columns={[{ key: "code", label: "Mã học phần" }, { key: "name", label: "Tên học phần" }, { key: "credits", label: "Tín chỉ" }]} />;
}
