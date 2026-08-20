import SubmissionForm from '../../../components/submissions/SubmissionForm';
import { submissionService } from '../../../services/submissionService';

export default function SubmitAssignmentPage({ assignmentId, mode = 'submit', onSubmitted }) {
  const submit = (file) => {
    const action = mode === 'resubmit'
      ? submissionService.resubmit(assignmentId, file)
      : submissionService.submit(assignmentId, file);
    return action.then(onSubmitted);
  };

  return <SubmissionForm mode={mode} onSubmit={submit} />;
}
