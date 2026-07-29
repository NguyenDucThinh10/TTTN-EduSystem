import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { ROLES } from "../../constants/roles";
export default function UserForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="fullName" label="Họ tên" defaultValue={initial.fullName} required /><Input name="email" label="Email" defaultValue={initial.email} required /><Select name="role" label="Vai trò" defaultValue={initial.role || ROLES.STUDENT} options={[{ value: ROLES.ADMIN, label: "Admin" }, { value: ROLES.TEACHER, label: "Giảng viên" }, { value: ROLES.STUDENT, label: "Sinh viên" }]} /><Button type="submit">Lưu tài khoản</Button></form>;
}
