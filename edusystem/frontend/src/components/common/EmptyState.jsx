export default function EmptyState({ title = "Chưa có dữ liệu", description = "Hãy tạo bản ghi mới để bắt đầu." }) {
  return <div className="empty-state"><strong>{title}</strong><p>{description}</p></div>;
}
