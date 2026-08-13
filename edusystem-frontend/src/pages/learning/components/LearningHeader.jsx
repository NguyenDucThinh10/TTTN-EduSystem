export default function LearningHeader({ onLogout, title = 'Hoc tap va danh gia', user }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">EduSystem</span>
        <h1>{title}</h1>
      </div>
      <div className="user-box">
        <div>
          <strong>{user.fullName || user.username}</strong>
          <span>{user.role}</span>
        </div>
        <button type="button" className="ghost-button" onClick={onLogout}>Dang xuat</button>
      </div>
    </header>
  );
}
