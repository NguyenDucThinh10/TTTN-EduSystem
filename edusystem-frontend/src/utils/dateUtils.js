export function formatDate(value) {
  if (!value) return 'Chua dat';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toApiDate(value) {
  return value ? `${value}:00` : null;
}

export function isPastDate(value) {
  return value ? new Date(value).getTime() < Date.now() : false;
}
