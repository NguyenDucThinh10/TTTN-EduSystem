import Button from "../common/Button";
import Input from "../common/Input";
export default function AssignmentForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="title" label="Tên bài tập" defaultValue={initial.title} required /><Input name="deadline" label="Hạn nộp" type="datetime-local" defaultValue={initial.deadline} /><Input name="maxScore" label="Điểm tối đa" type="number" defaultValue={initial.maxScore || 10} /><Button type="submit">Lưu bài tập</Button></form>;
}
