export default function ScoreDistributionChart({ distribution = [] }) {
  const max = Math.max(1, ...distribution.map((item) => Number(item.count || 0)));
  return (
    <div className="bar-chart">
      {distribution.map((item) => (
        <div className="bar-row" key={item.range}>
          <span>{item.range}</span>
          <div><i style={{ width: `${(Number(item.count || 0) / max) * 100}%` }} /></div>
          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}
