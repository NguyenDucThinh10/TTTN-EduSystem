import StatusBadge from '../common/StatusBadge';
import { ASSIGNMENT_STATUS_LABELS } from '../../constants/assignmentStatus';

export default function AssignmentStatusBadge({ status }) {
  return <StatusBadge status={status}>{ASSIGNMENT_STATUS_LABELS[status] || status}</StatusBadge>;
}
