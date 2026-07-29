import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}><Input label="Tên đăng nhập" value={form.username} onChange={update("username")} required /><Input label="Mật khẩu" type="password" value={form.password} onChange={update("password")} required /><Button type="submit" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Button></form>;
}
