export function score(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '-';
}

export function average(items, selector = (item) => item) {
  const values = items.map(selector).map(Number).filter(Number.isFinite);
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function weightedScore(scoreValue, maxScore = 10, weight = 1) {
  if (!Number.isFinite(Number(scoreValue)) || !Number(maxScore)) return 0;
  return (Number(scoreValue) / Number(maxScore)) * Number(weight || 1);
}
