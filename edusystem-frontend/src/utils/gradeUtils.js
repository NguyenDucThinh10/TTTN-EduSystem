export function score(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '-';
}

export function average(items, selector = (item) => item) {
  const values = items.map(selector).map(Number).filter(Number.isFinite);
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
