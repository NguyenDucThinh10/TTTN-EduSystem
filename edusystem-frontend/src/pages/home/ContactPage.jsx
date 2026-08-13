import HomeLayout from './HomeLayout';
import { supportChannels } from './homeContent';

export default function ContactPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero contact">
          <p className="home-eyebrow">Hỗ trợ người dùng</p>
          <h1>Liên hệ hỗ trợ</h1>
          <p>Gửi yêu cầu hỗ trợ về tài khoản, lớp học, bài tập, nộp bài hoặc điểm số. Bộ phận phụ trách sẽ phản hồi theo kênh phù hợp.</p>
        </section>

        <section className="home-section home-contact-layout">
          <div className="home-contact-cards">
            {supportChannels.map((channel) => (
              <article className="home-contact-card" key={channel.title}>
                <span>{channel.title}</span>
                <h2>{channel.value}</h2>
                <p>{channel.detail}</p>
              </article>
            ))}
          </div>

          <form className="home-contact-form">
            <h2>Gửi yêu cầu hỗ trợ</h2>
            <label>
              Họ và tên
              <input placeholder="Nhập họ tên" type="text" />
            </label>
            <label>
              Email
              <input placeholder="name@example.com" type="email" />
            </label>
            <label>
              Nội dung
              <textarea placeholder="Mô tả vấn đề cần hỗ trợ" rows="5" />
            </label>
            <button type="button">Gửi yêu cầu</button>
          </form>
        </section>

        <section className="home-section home-map-panel">
          <div>
            <p className="home-eyebrow">Cơ sở trực thuộc</p>
            <h2>Bản đồ cơ sở</h2>
            <p>Phòng hỗ trợ đặt tại khu hành chính của cơ sở chính. Sinh viên có thể đến trực tiếp hoặc gửi yêu cầu qua email.</p>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
