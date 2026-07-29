import { FileText } from "lucide-react";
export default function FilePreview({ file }) {
  return <div className="file-preview"><FileText size={24} /><div><strong>{file?.name || "Chưa chọn file"}</strong><p>{file?.type || "Thông tin file sẽ hiển thị tại đây"}</p></div></div>;
}
