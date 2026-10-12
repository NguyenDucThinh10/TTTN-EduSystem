export default function StatusBadge({ children, status }) {
  return <span className={`badge ${status || ''}`}>{children || status || 'Moi'}</span>;
}
