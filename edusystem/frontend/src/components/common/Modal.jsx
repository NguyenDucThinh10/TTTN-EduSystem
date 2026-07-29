import Button from "./Button";
export default function Modal({ title, children, open, onClose }) {
  if (!open) return null;
  return <div className="modal-backdrop"><section className="panel"><div className="actions"><h2>{title}</h2><Button variant="ghost" onClick={onClose}>Đóng</Button></div>{children}</section></div>;
}
