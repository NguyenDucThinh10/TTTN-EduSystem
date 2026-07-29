import Button from "../common/Button";
import Input from "../common/Input";
export default function ClassroomForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="name" label="Tên lớp học phần" defaultValue={initial.name} required /><Input name="courseCode" label="Mã học phần" defaultValue={initial.courseCode} required /><Input name="teacher" label="Giảng viên" defaultValue={initial.teacher} /><Button type="submit">Lưu lớp học</Button></form>;
}
