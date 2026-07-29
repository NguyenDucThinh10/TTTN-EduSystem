import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function AssignmentTable({ assignments = [] }) {
  return <DataTable data={assignments} columns={[{ key: "title", label: "Bai tap" }, { key: "deadline", label: "Han nop" }, { key: "status", label: "Trang thai", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
