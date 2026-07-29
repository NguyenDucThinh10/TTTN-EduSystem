import UserForm from "../../components/forms/UserForm";
import PageTemplate from "../PageTemplate";
export default function ProfilePage() {
  return <PageTemplate title="Hồ sơ cá nhân" description="Xem và cập nhật thông tin người dùng."><section className="panel"><UserForm initial={{ fullName: "Người dùng EduLMS", email: "user@edulms.local" }} /></section></PageTemplate>;
}
