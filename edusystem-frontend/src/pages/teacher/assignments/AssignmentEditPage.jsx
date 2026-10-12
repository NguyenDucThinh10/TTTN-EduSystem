import AssignmentForm from '../../../components/assignments/AssignmentForm';
import { assignmentService } from '../../../services/assignmentService';

export default function AssignmentEditPage({ assignment, onSaved }) {
  return <AssignmentForm initialValue={assignment} onSubmit={(data) => assignmentService.save({ ...data, assignmentId: assignment.id }).then(onSaved)} />;
}
