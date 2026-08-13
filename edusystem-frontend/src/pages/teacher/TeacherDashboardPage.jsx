import GradeSummary from '../../components/grades/GradeSummary';
import SubmissionChart from '../../components/charts/SubmissionChart';

export default function TeacherDashboardPage({ dashboard }) {
  return (
    <section className="page-section">
      <h2>Teacher Dashboard</h2>
      <GradeSummary
        averageScore={dashboard?.averageScore}
        gradedCount={dashboard?.gradedSubmissionCount}
        totalCount={dashboard?.assignmentCount}
      />
      <SubmissionChart submitted={dashboard?.submissionCount || 0} total={dashboard?.assignmentCount || 0} />
    </section>
  );
}
