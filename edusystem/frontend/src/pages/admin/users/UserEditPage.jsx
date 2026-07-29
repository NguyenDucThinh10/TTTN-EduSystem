import UserForm from "../../../components/forms/UserForm"; import PageTemplate from "../../PageTemplate";
export default function UserEditPage() { return <PageTemplate title="Chinh sua tai khoan" description="Cap nhat thong tin nguoi dung."><section className="panel"><UserForm initial={{ fullName: "Tran Thi B", email: "teacher@edulms.local", role: "TEACHER" }} /></section></PageTemplate>; }
