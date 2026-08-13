import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import HomeLayout from './HomeLayout';
import { featuredCourses, latestNews } from './homeContent';

const stats = [
  { value: '5+', label: 'hoc phan noi bat' },
  { value: '24/7', label: 'truy cap hoc lieu' },
  { value: '100%', label: 'theo doi tien do' },
];

const features = [
  'Quan ly lop hoc, bai tap va han nop tap trung',
  'Sinh vien nop bai, xem phan hoi va diem so truc tuyen',
  'Giang vien theo doi tien do va thong ke ket qua hoc tap',
];

export default function HomePage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(9, 30, 66, 0.86), rgba(9, 30, 66, 0.42)), url(${heroImage})` }}>
          <div className="home-hero-content">
            <p className="home-eyebrow">EduLMS Portal</p>
            <h1>He thong quan ly hoc tap hien dai cho nha truong</h1>
            <p>
              Ket noi giang vien va sinh vien qua lop hoc so, bai tap, nop bai, cham diem va thong bao hoc vu trong mot nen tang thong nhat.
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-action large" to={user ? '/learning' : '/login'}>
                Bat dau su dung
              </Link>
              <Link className="home-secondary-action large" to="/khoa-hoc">
                Xem khoa hoc
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
            <p className="home-eyebrow">Tinh nang noi bat</p>
            <h2>Nen tang hoc tap tap trung</h2>
            <p>
              Trang chu mau tap trung vao thong tin hoc vu, tin tuc moi, hoc phan noi bat va loi vao he thong LMS cho nguoi dung.
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
              <p className="home-eyebrow">Hoc phan noi bat</p>
              <h2>Khoa hoc dang mo</h2>
            </div>
            <Link to="/khoa-hoc">Xem tat ca</Link>
          </div>
          <div className="home-card-grid three">
            {featuredCourses.slice(0, 3).map((course) => (
              <article className="home-card" key={course.title}>
                <img alt={course.title} src={course.image} />
                <div>
                  <span className="home-tag">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">Cap nhat hoc vu</p>
              <h2>Tin tuc moi nhat</h2>
            </div>
            <Link to="/tin-tuc">Doc them</Link>
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
