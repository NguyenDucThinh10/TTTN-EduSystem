import AssignmentCard from '../../../components/assignments/AssignmentCard';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/common/Loading';
import { useAssignment } from '../../../hooks/useAssignment';

export default function AssignmentListPage({ classId, onSelect }) {
  const { assignments, loading } = useAssignment(classId);
  if (loading) return <Loading />;
  if (!assignments.length) return <EmptyState image="/images/assignment-empty.png" title="Chua co bai tap" />;
  return assignments.map((assignment) => (
    <AssignmentCard key={assignment.id} assignment={assignment} onSelect={onSelect} />
  ));
}
