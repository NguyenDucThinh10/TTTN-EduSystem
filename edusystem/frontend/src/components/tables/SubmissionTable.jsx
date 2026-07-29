import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function SubmissionTable({ submissions = [] }) {
  return <DataTable data={submissions} columns={[{ key: "student", label: "Sinh viên" }, { key: "assignment", label: "Bài tập" }, { key: "submittedAt", label: "Thời gian nộp" }, { key: "status", label: "Trạng thái", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
