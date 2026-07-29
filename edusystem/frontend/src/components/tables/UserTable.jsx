import StatusBadge from "../common/StatusBadge";
import DataTable from "./DataTable";
export default function UserTable({ users = [] }) {
  return <DataTable data={users} columns={[{ key: "fullName", label: "Họ tên" }, { key: "email", label: "Email" }, { key: "role", label: "Vai trò" }, { key: "status", label: "Trạng thái", render: (row) => <StatusBadge status={row.status} /> }]} />;
}
