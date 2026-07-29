import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageTemplate from "../PageTemplate";
export default function ChangePasswordPage() {
  return <PageTemplate title="Doi mat khau" description="Cap nhat mat khau dang nhap."><section className="panel grid"><Input label="Mat khau hien tai" type="password" /><Input label="Mat khau moi" type="password" /><Button>Luu thay doi</Button></section></PageTemplate>;
}
