export default function ProgressChart({ completionRate = 0 }) {
  return (
    <div className="progress-chart">
      <div style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }} />
      <span>{Math.round(completionRate)}%</span>
    </div>
  );
}
