export default function SubmissionChart({ value = 84 }) {
  return <div className="mini-chart"><span>Ty le nop bai</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>;
}
