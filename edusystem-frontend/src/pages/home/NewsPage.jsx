import HomeLayout from './HomeLayout';
import { latestNews } from './homeContent';

const guides = [
  'Huong dan dang nhap va cap nhat thong tin ca nhan',
  'Quy trinh nop bai tap va xem trang thai cham diem',
  'Cach theo doi diem thanh phan va tien do hoc tap',
];

export default function NewsPage({ user, onLogout }) {
  const mainNews = latestNews[0];

  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero news">
          <p className="home-eyebrow">Tin tuc va thong bao</p>
          <h1>Cap nhat moi tu EduLMS</h1>
          <p>Theo doi thong bao hoc vu, lich huong dan va cac tai lieu su dung he thong cho giang vien, sinh vien.</p>
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
              <h2>Tai lieu huong dan</h2>
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
