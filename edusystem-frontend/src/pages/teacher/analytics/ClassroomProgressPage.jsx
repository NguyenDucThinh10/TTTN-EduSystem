import ProgressChart from '../../../components/charts/ProgressChart';

export default function ClassroomProgressPage({ progress = [] }) {
  return progress.map((item) => (
    <article key={item.studentId}>
      <strong>{item.studentName}</strong>
      <ProgressChart completionRate={item.completionRate} />
    </article>
  ));
}
