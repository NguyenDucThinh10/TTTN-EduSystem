import UserForm from "../../../components/forms/UserForm"; import PageTemplate from "../../PageTemplate";
export default function UserCreatePage() { return <PageTemplate title="Tạo tài khoản mới" description="Thêm người dùng vào hệ thống."><section className="panel"><UserForm /></section></PageTemplate>; }
