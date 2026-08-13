import { score } from '../../utils/gradeUtils';

export default function GradeTable({ grades = [] }) {
  return (
    <div className="grade-table">
      <div className="table-head"><span>Bai tap</span><span>Sinh vien</span><span>Diem</span><span>Feedback</span></div>
      {grades.map((grade) => (
        <div className="table-row" key={grade.id}>
          <span>{grade.assignmentTitle}</span>
          <span>{grade.studentName}</span>
          <span>{score(grade.score)} / {score(grade.maxScore)}</span>
          <span>{grade.feedback || '-'}</span>
        </div>
      ))}
    </div>
  );
}
