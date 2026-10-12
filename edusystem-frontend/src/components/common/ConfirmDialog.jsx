import Modal from './Modal';

export default function ConfirmDialog({ message, onCancel, onConfirm, open, title = 'Xac nhan' }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="dialog-actions">
        <button type="button" onClick={onCancel}>Huy</button>
        <button type="button" onClick={onConfirm}>Dong y</button>
      </div>
    </Modal>
  );
}
