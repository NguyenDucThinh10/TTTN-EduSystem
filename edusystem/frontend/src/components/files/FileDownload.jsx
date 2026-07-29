import { Download } from "lucide-react";
import Button from "../common/Button";
export default function FileDownload({ label = "Tai file", onClick }) {
  return <Button variant="secondary" onClick={onClick}><Download size={16} /> {label}</Button>;
}
