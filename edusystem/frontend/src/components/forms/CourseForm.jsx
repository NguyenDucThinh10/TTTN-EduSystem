import Button from "../common/Button";
import Input from "../common/Input";
export default function CourseForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="code" label="Mã học phần" defaultValue={initial.code} required /><Input name="name" label="Tên học phần" defaultValue={initial.name} required /><Input name="credits" label="Số tín chỉ" type="number" defaultValue={initial.credits || 3} /><Button type="submit">Lưu học phần</Button></form>;
}
