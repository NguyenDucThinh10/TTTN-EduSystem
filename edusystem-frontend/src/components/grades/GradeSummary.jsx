import { score } from '../../utils/gradeUtils';

export default function GradeSummary({ averageScore = 0, gradedCount = 0, totalCount = 0 }) {
  return (
    <section className="grade-summary">
      <div><strong>{score(averageScore)}</strong><span>Diem TB</span></div>
      <div><strong>{gradedCount}</strong><span>Da cham</span></div>
      <div><strong>{totalCount}</strong><span>Tong bai</span></div>
    </section>
  );
}
