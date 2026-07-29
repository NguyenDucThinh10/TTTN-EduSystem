import UserForm from "../../components/forms/UserForm";
import PageTemplate from "../PageTemplate";
export default function ProfilePage() {
  return <PageTemplate title="Ho so ca nhan" description="Xem va cap nhat thong tin nguoi dung."><section className="panel"><UserForm initial={{ fullName: "Nguoi dung EduLMS", email: "user@edulms.local" }} /></section></PageTemplate>;
}
