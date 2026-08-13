import GradeSummary from '../../components/grades/GradeSummary';
import ProgressChart from '../../components/charts/ProgressChart';

export default function StudentDashboardPage({ progress, gradebook }) {
  return (
    <section className="page-section">
      <h2>Student Dashboard</h2>
      <GradeSummary averageScore={gradebook?.averageScore} gradedCount={gradebook?.grades?.length || 0} totalCount={progress?.totalAssignments || 0} />
      <ProgressChart completionRate={progress?.completionRate || 0} />
    </section>
  );
}
