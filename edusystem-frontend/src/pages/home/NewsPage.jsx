import HomeLayout from './HomeLayout';
import { latestNews } from './homeContent';

const guides = [
  'Hướng dẫn đăng nhập và cập nhật thông tin cá nhân',
  'Quy trình nộp bài tập và xem trạng thái chấm điểm',
  'Cách theo dõi điểm thành phần và tiến độ học tập',
];

export default function NewsPage({ user, onLogout }) {
  const mainNews = latestNews[0];

  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero news">
          <p className="home-eyebrow">Tin tức và thông báo</p>
          <h1>Cập nhật mới từ EduLMS</h1>
          <p>Theo dõi thông báo học vụ, lịch hướng dẫn và các tài liệu sử dụng hệ thống cho giảng viên, sinh viên.</p>
        </section>

        <section className="home-section">
          <article className="home-featured-news">
            <img alt={mainNews.title} src={mainNews.image} />
            <div>
              <span className="home-tag">{mainNews.tag}</span>
              <h2>{mainNews.title}</h2>
              <p>{mainNews.summary}</p>
              <small>{mainNews.date}</small>
            </div>
          </article>

          <div className="home-news-layout">
            <div className="home-news-list">
              {latestNews.slice(1).map((news) => (
                <article className="home-news-row" key={news.title}>
                  <img alt={news.title} src={news.image} />
                  <div>
                    <span>{news.date} · {news.tag}</span>
                    <h3>{news.title}</h3>
                    <p>{news.summary}</p>
                  </div>
                </article>
              ))}
            </div>
            <aside className="home-guide-panel">
              <h2>Tài liệu hướng dẫn</h2>
              {guides.map((guide) => (
                <p key={guide}>{guide}</p>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
