import EmptyState from '../../../components/common/EmptyState';
import SubmissionCard from '../../../components/submissions/SubmissionCard';
import { useSubmission } from '../../../hooks/useSubmission';

export default function MySubmissionPage() {
  const { submissions } = useSubmission({ mine: true });
  if (!submissions.length) return <EmptyState image="/images/submission-empty.png" title="Ban chua nop bai nao" />;
  return submissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />);
}
