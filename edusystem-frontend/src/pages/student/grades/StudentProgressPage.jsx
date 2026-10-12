import ProgressChart from '../../../components/charts/ProgressChart';

export default function StudentProgressPage({ progress }) {
  return (
    <section className="page-section">
      <h2>Tien do hoc tap</h2>
      <ProgressChart completionRate={progress?.completionRate || 0} />
      <span>{progress?.submittedAssignments || 0}/{progress?.totalAssignments || 0} bai da nop</span>
    </section>
  );
}
