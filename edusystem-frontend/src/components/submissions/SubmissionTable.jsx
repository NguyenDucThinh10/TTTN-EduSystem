import SubmissionStatusBadge from './SubmissionStatusBadge';
import FileDownload from '../files/FileDownload';
import { formatDate } from '../../utils/dateUtils';
import { score } from '../../utils/gradeUtils';

export default function SubmissionTable({ onGrade, rows = [] }) {
  return (
    <div className="submission-table">
      <div className="table-head">
        <span>Sinh vien</span><span>Trang thai</span><span>Nop luc</span><span>Diem</span><span></span>
      </div>
      {rows.map((row) => (
        <div className="table-row" key={row.studentId || row.id}>
          <span>{row.studentName}</span>
          <SubmissionStatusBadge status={row.submission?.status || row.status} />
          <span>{formatDate(row.submission?.submittedAt || row.submittedAt)}</span>
          <span>{score(row.submission?.score ?? row.score)}</span>
          <div className="row-actions">
            <FileDownload fileUrl={row.submission?.fileUrl || row.fileUrl} />
            {onGrade && row.submission && <button type="button" onClick={() => onGrade(row.submission)}>Cham</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
