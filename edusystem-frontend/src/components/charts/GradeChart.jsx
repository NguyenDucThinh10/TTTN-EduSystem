import { score } from '../../utils/gradeUtils';

export default function GradeChart({ grades = [] }) {
  const max = Math.max(10, ...grades.map((item) => Number(item.score || 0)));
  return (
    <div className="bar-chart">
      {grades.map((grade) => (
        <div className="bar-row" key={grade.id}>
          <span>{grade.assignmentTitle}</span>
          <div><i style={{ width: `${(Number(grade.score || 0) / max) * 100}%` }} /></div>
          <strong>{score(grade.score)}</strong>
        </div>
      ))}
    </div>
  );
}
