import UserForm from "../../../components/forms/UserForm"; import PageTemplate from "../../PageTemplate";
export default function UserEditPage() { return <PageTemplate title="Chỉnh sửa tài khoản" description="Cập nhật thông tin người dùng."><section className="panel"><UserForm initial={{ fullName: "Trần Thị B", email: "teacher@edulms.local", role: "TEACHER" }} /></section></PageTemplate>; }
