import Button from "../common/Button";
import Input from "../common/Input";
export default function AssignmentForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="title" label="Ten bai tap" defaultValue={initial.title} required /><Input name="deadline" label="Han nop" type="datetime-local" defaultValue={initial.deadline} /><Input name="maxScore" label="Diem toi da" type="number" defaultValue={initial.maxScore || 10} /><Button type="submit">Luu bai tap</Button></form>;
}
