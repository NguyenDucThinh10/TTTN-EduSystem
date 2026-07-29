import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { ROLES } from "../../constants/roles";
export default function UserForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="fullName" label="Ho ten" defaultValue={initial.fullName} required /><Input name="email" label="Email" defaultValue={initial.email} required /><Select name="role" label="Vai tro" defaultValue={initial.role || ROLES.STUDENT} options={[{ value: ROLES.ADMIN, label: "Admin" }, { value: ROLES.TEACHER, label: "Giang vien" }, { value: ROLES.STUDENT, label: "Sinh vien" }]} /><Button type="submit">Luu tai khoan</Button></form>;
}
