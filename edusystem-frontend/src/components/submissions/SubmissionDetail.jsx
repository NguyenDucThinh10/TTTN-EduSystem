import FilePreview from '../files/FilePreview';
import SubmissionStatusBadge from './SubmissionStatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { score } from '../../utils/gradeUtils';

export default function SubmissionDetail({ submission }) {
  if (!submission) return null;
  return (
    <section className="submission-detail">
      <h2>{submission.assignmentTitle}</h2>
      <SubmissionStatusBadge status={submission.status} />
      <span>Nop luc: {formatDate(submission.submittedAt)}</span>
      <span>Diem: {submission.score != null ? score(submission.score) : 'Chua cham'}</span>
      <p>{submission.feedback || 'Chua co nhan xet.'}</p>
      <FilePreview fileUrl={submission.fileUrl} />
    </section>
  );
}
