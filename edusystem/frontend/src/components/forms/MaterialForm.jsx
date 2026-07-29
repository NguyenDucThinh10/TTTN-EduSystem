import Button from "../common/Button";
import Input from "../common/Input";
import FileUpload from "../files/FileUpload";
export default function MaterialForm({ onSubmit = () => {} }) {
  return <form className="grid" onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}><Input name="title" label="Tên tài liệu" required /><Input name="description" label="Mô tả" /><FileUpload name="file" /><Button type="submit">Lưu tài liệu</Button></form>;
}
