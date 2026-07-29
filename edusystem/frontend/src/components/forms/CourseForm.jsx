import Button from "../common/Button";
import Input from "../common/Input";
export default function CourseForm({ initial = {}, onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="code" label="Ma hoc phan" defaultValue={initial.code} required /><Input name="name" label="Ten hoc phan" defaultValue={initial.name} required /><Input name="credits" label="So tin chi" type="number" defaultValue={initial.credits || 3} /><Button type="submit">Luu hoc phan</Button></form>;
}
