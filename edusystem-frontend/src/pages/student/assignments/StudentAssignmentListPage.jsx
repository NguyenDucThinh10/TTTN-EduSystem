import AssignmentCard from '../../../components/assignments/AssignmentCard';
import EmptyState from '../../../components/common/EmptyState';
import { useAssignment } from '../../../hooks/useAssignment';

export default function StudentAssignmentListPage({ classId, onSelect }) {
  const { assignments } = useAssignment(classId);
  if (!assignments.length) return <EmptyState image="/images/assignment-empty.png" title="Chua co bai tap" />;
  return assignments.map((assignment) => (
    <AssignmentCard key={assignment.id} assignment={assignment} onSelect={onSelect} />
  ));
}
