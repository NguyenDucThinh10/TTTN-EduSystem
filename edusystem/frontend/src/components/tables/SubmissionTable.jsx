import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function SubmissionTable({ submissions = [] }) {
  return <DataTable data={submissions} columns={[{ key: "student", label: "Sinh vien" }, { key: "assignment", label: "Bai tap" }, { key: "submittedAt", label: "Thoi gian nop" }, { key: "status", label: "Trang thai", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
