import AssignmentForm from '../../../components/assignments/AssignmentForm';
import { assignmentService } from '../../../services/assignmentService';

export default function AssignmentCreatePage({ classId, onCreated }) {
  return <AssignmentForm onSubmit={(data) => assignmentService.save({ ...data, payload: { ...data.payload, classId } }).then(onCreated)} />;
}
