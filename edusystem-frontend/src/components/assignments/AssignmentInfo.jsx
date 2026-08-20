import DeadlineDisplay from './DeadlineDisplay';
import FileDownload from '../files/FileDownload';
import { score } from '../../utils/gradeUtils';

export default function AssignmentInfo({ assignment }) {
  if (!assignment) return null;
  return (
    <section className="assignment-info">
      <h2>{assignment.title}</h2>
      <p>{assignment.description || 'Khong co mo ta.'}</p>
      <span>Han nop: <DeadlineDisplay dueDate={assignment.dueDate} /></span>
      <span>Diem: {score(assignment.maxScore)}</span>
      <FileDownload fileUrl={assignment.fileUrl} label="Tai de bai" />
    </section>
  );
}
