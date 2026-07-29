import SearchBox from "../../../components/common/SearchBox";
import Button from "../../../components/common/Button";
import UserTable from "../../../components/tables/UserTable";
import PageTemplate from "../../PageTemplate";
const users = [{ id: 1, fullName: "Nguyen Van A", email: "admin@edulms.local", role: "ADMIN", status: "ACTIVE" }, { id: 2, fullName: "Tran Thi B", email: "teacher@edulms.local", role: "TEACHER", status: "ACTIVE" }, { id: 3, fullName: "Le Van C", email: "student@edulms.local", role: "STUDENT", status: "INACTIVE" }];
export default function UserListPage() { return <PageTemplate title="Danh sach tai khoan" description="Quan ly tai khoan sinh vien, giang vien va admin."><div className="actions" style={{ marginBottom: 12 }}><SearchBox value="" onChange={() => {}} /><Button>Tao tai khoan</Button></div><UserTable users={users} /></PageTemplate>; }
