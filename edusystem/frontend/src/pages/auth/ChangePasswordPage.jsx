import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageTemplate from "../PageTemplate";
export default function ChangePasswordPage() {
  return <PageTemplate title="Đổi mật khẩu" description="Cập nhật mật khẩu đăng nhập."><section className="panel grid"><Input label="Mật khẩu hiện tại" type="password" /><Input label="Mật khẩu mới" type="password" /><Button>Lưu thay đổi</Button></section></PageTemplate>;
}
