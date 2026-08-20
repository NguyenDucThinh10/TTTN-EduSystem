import { ASSIGNMENT_STATUS_LABELS } from '../constants/assignmentStatus';
import { SUBMISSION_STATUS_LABELS } from '../constants/submissionStatus';
import { fileHref } from './fileUtils';
import { formatDate } from './dateUtils';
import { score } from './gradeUtils';

export { fileHref, formatDate, score };

export function statusLabel(status) {
  if (status === 'ONGOING') return 'Đang diễn ra';
  if (status === 'COMPLETED') return 'Đã kết thúc';
  return ASSIGNMENT_STATUS_LABELS[status] || SUBMISSION_STATUS_LABELS[status] || status || 'Moi';
}
