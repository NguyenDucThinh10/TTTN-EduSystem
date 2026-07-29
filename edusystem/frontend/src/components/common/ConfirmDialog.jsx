import Button from "./Button";
import Modal from "./Modal";
export default function ConfirmDialog({ open, title = "Xác nhận", message, onCancel, onConfirm }) {
  return <Modal open={open} title={title} onClose={onCancel}><p>{message}</p><div className="actions"><Button variant="secondary" onClick={onCancel}>Hủy</Button><Button variant="danger" onClick={onConfirm}>Xác nhận</Button></div></Modal>;
}
