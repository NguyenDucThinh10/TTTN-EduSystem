import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function AssignmentTable({ assignments = [] }) {
  return <DataTable data={assignments} columns={[{ key: "title", label: "Bài tập" }, { key: "deadline", label: "Hạn nộp" }, { key: "status", label: "Trạng thái", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
