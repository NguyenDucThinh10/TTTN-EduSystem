import SubmissionChart from '../../../components/charts/SubmissionChart';

export default function SubmissionStatisticsPage({ statistics = [] }) {
  return statistics.map((item) => (
    <article key={item.assignmentId}>
      <strong>{item.assignmentTitle}</strong>
      <SubmissionChart submitted={item.submissionCount} total={item.totalStudents || item.submissionCount} />
    </article>
  ));
}
