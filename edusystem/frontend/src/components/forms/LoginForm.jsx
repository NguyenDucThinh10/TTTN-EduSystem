import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}><Input label="Ten dang nhap" value={form.username} onChange={update("username")} required /><Input label="Mat khau" type="password" value={form.password} onChange={update("password")} required /><Button type="submit" disabled={loading}>{loading ? "Dang dang nhap..." : "Dang nhap"}</Button></form>;
}
