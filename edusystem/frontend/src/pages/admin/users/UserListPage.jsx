import SearchBox from "../../../components/common/SearchBox";
import Button from "../../../components/common/Button";
import UserTable from "../../../components/tables/UserTable";
import PageTemplate from "../../PageTemplate";
const users = [{ id: 1, fullName: "Nguyễn Văn A", email: "admin@edulms.local", role: "ADMIN", status: "ACTIVE" }, { id: 2, fullName: "Trần Thị B", email: "teacher@edulms.local", role: "TEACHER", status: "ACTIVE" }, { id: 3, fullName: "Lê Văn C", email: "student@edulms.local", role: "STUDENT", status: "INACTIVE" }];
export default function UserListPage() { return <PageTemplate title="Danh sách tài khoản" description="Quản lý tài khoản sinh viên, giảng viên và admin."><div className="actions" style={{ marginBottom: 12 }}><SearchBox value="" onChange={() => {}} /><Button>Tạo tài khoản</Button></div><UserTable users={users} /></PageTemplate>; }
