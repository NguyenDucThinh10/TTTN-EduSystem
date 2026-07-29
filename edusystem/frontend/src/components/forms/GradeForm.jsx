import Button from "../common/Button";
import Input from "../common/Input";
export default function GradeForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="score" label="Diem" type="number" min="0" max="10" step="0.1" defaultValue={initial.score} /><textarea name="feedback" rows="4" defaultValue={initial.feedback} placeholder="Nhan xet" /><Button type="submit">Luu diem</Button></form>;
}
