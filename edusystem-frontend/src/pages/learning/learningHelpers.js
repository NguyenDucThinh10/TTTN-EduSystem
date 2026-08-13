import { ASSIGNMENT_STATUS_LABELS } from '../../constants/assignmentStatus';
import { SUBMISSION_STATUS_LABELS } from '../../constants/submissionStatus';
import { fileHref } from '../../utils/fileUtils';
import { formatDate, toApiDate } from '../../utils/dateUtils';
import { score } from '../../utils/gradeUtils';

export { fileHref, formatDate, score, toApiDate };

export function statusLabel(status) {
  return ASSIGNMENT_STATUS_LABELS[status] || SUBMISSION_STATUS_LABELS[status] || status || 'Moi';
}
