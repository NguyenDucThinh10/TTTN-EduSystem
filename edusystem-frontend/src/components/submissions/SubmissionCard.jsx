import SubmissionStatusBadge from './SubmissionStatusBadge';
import FileDownload from '../files/FileDownload';
import { formatDate } from '../../utils/dateUtils';
import { score } from '../../utils/gradeUtils';

export default function SubmissionCard({ submission }) {
  return (
    <article className="submission-card">
      <strong>{submission.assignmentTitle}</strong>
      <span>{formatDate(submission.submittedAt)}</span>
      <SubmissionStatusBadge status={submission.status} />
      <span>{submission.score != null ? `${score(submission.score)} diem` : 'Chua cham'}</span>
      <FileDownload fileUrl={submission.fileUrl} />
    </article>
  );
}
