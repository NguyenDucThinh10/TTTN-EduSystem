import Button from "./Button";
import Modal from "./Modal";
export default function ConfirmDialog({ open, title = "Xac nhan", message, onCancel, onConfirm }) {
  return <Modal open={open} title={title} onClose={onCancel}><p>{message}</p><div className="actions"><Button variant="secondary" onClick={onCancel}>Huy</Button><Button variant="danger" onClick={onConfirm}>Xac nhan</Button></div></Modal>;
}
