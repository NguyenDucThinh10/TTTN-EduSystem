import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { ROLES } from "../../constants/roles";

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ fullName: "", username: "", password: "", confirmPassword: "", role: ROLES.STUDENT });
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <Input label="Họ tên" value={form.fullName} onChange={update("fullName")} required />
      <Input label="Tên đăng nhập" value={form.username} onChange={update("username")} required />
      <Input label="Mật khẩu" type="password" value={form.password} onChange={update("password")} required />
      <Input label="Nhập lại mật khẩu" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required />
      <Select label="Vai trò" value={form.role} onChange={update("role")} options={[
        { value: ROLES.STUDENT, label: "Sinh viên" },
        { value: ROLES.TEACHER, label: "Giảng viên" },
        { value: ROLES.ADMIN, label: "Admin" }
      ]} />
      <Button type="submit" disabled={loading}>{loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}</Button>
    </form>
  );
}
