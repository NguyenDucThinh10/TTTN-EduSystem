import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function UserTable({ users = [] }) {
  return <DataTable data={users} columns={[{ key: "fullName", label: "Ho ten" }, { key: "email", label: "Email" }, { key: "role", label: "Vai tro" }, { key: "status", label: "Trang thai", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
