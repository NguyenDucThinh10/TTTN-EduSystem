export default function EmptyState({ image, title = 'Chua co du lieu', description = '' }) {
  return (
    <div className="empty-state">
      {image && <img src={image} alt="" />}
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </div>
  );
}
