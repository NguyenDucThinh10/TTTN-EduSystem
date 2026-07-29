import { Upload } from "lucide-react";
export default function FileUpload({ name = "file" }) {
  return <label className="file-upload"><Upload size={18} /><span>Chon file</span><input name={name} type="file" /></label>;
}
