import Button from "../common/Button";
import FileUpload from "../files/FileUpload";
export default function SubmissionForm({ onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><FileUpload name="file" /><textarea name="note" rows="4" placeholder="Ghi chu cho giang vien" /><Button type="submit">Nop bai</Button></form>;
}
