import FeedbackBox from './FeedbackBox';
import { score } from '../../utils/gradeUtils';

export default function GradeCard({ grade }) {
  return (
    <article className="grade-card">
      <strong>{grade.assignmentTitle}</strong>
      <span>{score(grade.score)} / {score(grade.maxScore)}</span>
      <FeedbackBox feedback={grade.feedback} />
    </article>
  );
}
