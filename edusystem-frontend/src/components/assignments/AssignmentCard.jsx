import DeadlineDisplay from './DeadlineDisplay';
import AssignmentStatusBadge from './AssignmentStatusBadge';
import FileDownload from '../files/FileDownload';

export default function AssignmentCard({ assignment, onDelete, onEdit, onSelect, selected }) {
  return (
    <article className={`assignment-card ${selected ? 'selected' : ''}`}>
      <button type="button" className="assignment-main" onClick={() => onSelect?.(assignment.id)}>
        <strong>{assignment.title}</strong>
        <span>Han nop: <DeadlineDisplay dueDate={assignment.dueDate} /></span>
        <span>{assignment.submissionCount || 0} bai nop</span>
      </button>
      <div className="assignment-actions">
        <AssignmentStatusBadge status={assignment.status} />
        <FileDownload fileUrl={assignment.fileUrl} label="Tai de" />
        {onEdit && <button type="button" onClick={() => onEdit(assignment)}>Sua</button>}
        {onDelete && <button type="button" className="danger" onClick={() => onDelete(assignment.id)}>Xoa</button>}
      </div>
    </article>
  );
}
