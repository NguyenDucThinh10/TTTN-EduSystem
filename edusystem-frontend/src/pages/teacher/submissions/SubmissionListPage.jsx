import SubmissionTable from '../../../components/submissions/SubmissionTable';
import { useSubmission } from '../../../hooks/useSubmission';

export default function SubmissionListPage({ assignmentId, onGrade }) {
  const { submissions } = useSubmission({ assignmentId });
  return <SubmissionTable rows={submissions} onGrade={onGrade} />;
}
