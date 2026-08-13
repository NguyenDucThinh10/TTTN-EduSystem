export default function SubmissionChart({ submitted = 0, total = 0 }) {
  const rate = total ? (submitted / total) * 100 : 0;
  return (
    <div className="submission-chart">
      <strong>{submitted}/{total}</strong>
      <span>Ty le nop bai {Math.round(rate)}%</span>
    </div>
  );
}
