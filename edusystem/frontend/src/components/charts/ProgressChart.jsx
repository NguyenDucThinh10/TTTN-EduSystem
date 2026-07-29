export default function ProgressChart({ value = 68 }) {
  return <div className="mini-chart"><span>Tiến độ học tập</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>;
}
