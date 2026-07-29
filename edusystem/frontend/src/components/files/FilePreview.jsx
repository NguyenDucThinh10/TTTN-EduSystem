import { FileText } from "lucide-react";
export default function FilePreview({ file }) {
  return <div className="file-preview"><FileText size={24} /><div><strong>{file?.name || "Chua chon file"}</strong><p>{file?.type || "Thong tin file se hien thi tai day"}</p></div></div>;
}
