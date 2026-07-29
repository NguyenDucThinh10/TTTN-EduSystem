import DataTable from "./DataTable";
export default function CourseTable({ courses = [] }) {
  return <DataTable data={courses} columns={[{ key: "code", label: "Ma hoc phan" }, { key: "name", label: "Ten hoc phan" }, { key: "credits", label: "Tin chi" }]} />;
}
