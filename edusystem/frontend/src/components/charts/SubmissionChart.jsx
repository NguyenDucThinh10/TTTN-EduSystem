export default function SubmissionChart({ value = 84 }) {
  return <div className="mini-chart"><span>Tỷ lệ nộp bài</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>;
}
