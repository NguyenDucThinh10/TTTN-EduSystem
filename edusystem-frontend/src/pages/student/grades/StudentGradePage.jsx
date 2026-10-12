import EmptyState from '../../../components/common/EmptyState';
import GradeCard from '../../../components/grades/GradeCard';

export default function StudentGradePage({ grades = [] }) {
  if (!grades.length) return <EmptyState image="/images/grade-empty.png" title="Chua co diem" />;
  return grades.map((grade) => <GradeCard key={grade.id} grade={grade} />);
}
