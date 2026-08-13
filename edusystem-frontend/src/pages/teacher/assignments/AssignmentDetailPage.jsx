import AssignmentInfo from '../../../components/assignments/AssignmentInfo';
import SubmissionTable from '../../../components/submissions/SubmissionTable';

export default function AssignmentDetailPage({ detail, onGrade }) {
  return (
    <>
      <AssignmentInfo assignment={detail?.assignment} />
      <SubmissionTable rows={detail?.submissions || []} onGrade={onGrade} />
    </>
  );
}
