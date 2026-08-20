import StatusBadge from '../common/StatusBadge';
import { SUBMISSION_STATUS_LABELS } from '../../constants/submissionStatus';

export default function SubmissionStatusBadge({ status }) {
  return <StatusBadge status={status}>{SUBMISSION_STATUS_LABELS[status] || status || 'Chua nop'}</StatusBadge>;
}
