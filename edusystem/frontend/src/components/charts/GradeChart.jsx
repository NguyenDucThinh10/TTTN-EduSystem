export default function GradeChart({ value = 7.8 }) {
  return <div className="mini-chart"><span>Điểm trung bình</span><div><i style={{ width: `${value * 10}%` }} /></div><strong>{value.toFixed(1)}/10</strong></div>;
}
