import Button from "../common/Button";
import Input from "../common/Input";
export default function ClassroomForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="name" label="Ten lop hoc phan" defaultValue={initial.name} required /><Input name="courseCode" label="Ma hoc phan" defaultValue={initial.courseCode} required /><Input name="teacher" label="Giang vien" defaultValue={initial.teacher} /><Button type="submit">Luu lop hoc</Button></form>;
}
