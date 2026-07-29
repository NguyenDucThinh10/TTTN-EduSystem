export default function EmptyState({ title = "Chua co du lieu", description = "Hay tao ban ghi moi de bat dau." }) {
  return <div className="empty-state"><strong>{title}</strong><p>{description}</p></div>;
}
