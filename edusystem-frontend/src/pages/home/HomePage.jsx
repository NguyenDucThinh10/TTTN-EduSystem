import { Link } from 'react-router-dom';
import HomeLayout from './HomeLayout';
import { featuredSubjects, latestNews } from './homeContent';

const stats = [
  { value: '12+', label: 'học phần nổi bật' },
  { value: '24/7', label: 'truy cập học liệu' },
  { value: '100%', label: 'theo dõi tiến độ' },
];

const features = [
  'Quản lý lớp học, bài tập và hạn nộp tập trung',
  'Sinh viên nộp bài, xem phản hồi và điểm số trực tuyến',
  'Giảng viên theo dõi tiến độ và thống kê kết quả học tập',
];

const roleHomePath = (role) => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TEACHER') return '/teacher';
  if (role === 'STUDENT') return '/student';
  return '/login';
};

export default function HomePage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <p className="home-eyebrow">EduLMS Portal</p>
            <h1>Hệ thống hỗ trợ quản lý hoạt động học tập và đánh giá sinh viên </h1>
            <p>
              Kết nối giảng viên và sinh viên qua lớp học số, bài tập, nộp bài, chấm điểm và thông báo học vụ trong một nền tảng thống nhất.
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-action large" to={user ? roleHomePath(user.role) : '/login'}>
                Bắt đầu sử dụng
              </Link>
              <Link className="home-secondary-action large" to="/khoa-hoc">
                Xem học phần
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section home-stat-band">
          {stats.map((item) => (
            <div className="home-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="home-section home-split">
          <div>
            <p className="home-eyebrow">Tính năng nổi bật</p>
            <h2>Nền tảng học tập tập trung</h2>
            <p>
              Trang chủ mẫu tập trung vào thông tin học vụ, tin tức mới, học phần nổi bật và lối vào hệ thống LMS cho người dùng.
            </p>
          </div>
          <div className="home-feature-list">
            {features.map((feature) => (
              <div className="home-feature-item" key={feature}>
                <span>✓</span>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">Học phần nổi bật</p>
              <h2>Học phần đang mở</h2>
            </div>
            <Link to="/khoa-hoc">Xem tất cả</Link>
          </div>
          <div className="home-card-grid three">
            {featuredSubjects.slice(0, 3).map((subject) => (
              <article className="home-card" key={subject.title}>
                <img alt={subject.title} src={subject.image} />
                <div>
                  <span className="home-tag">{subject.category}</span>
                  <h3>{subject.title}</h3>
                  <p>{subject.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">Cập nhật học vụ</p>
              <h2>Tin tức mới nhất</h2>
            </div>
            <Link to="/tin-tuc">Đọc thêm</Link>
          </div>
          <div className="home-news-list">
            {latestNews.map((news) => (
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
        </section>
      </main>
    </HomeLayout>
  );
}
