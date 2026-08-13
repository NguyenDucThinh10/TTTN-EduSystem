import HomeLayout from './HomeLayout';
import { featuredCourses } from './homeContent';

export default function CoursesPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero courses">
          <p className="home-eyebrow">Danh mục đào tạo</p>
          <h1>Khóa học Công nghệ thông tin</h1>
          <p>Các học phần mẫu được tổ chức theo hướng thực hành, có thông tin thời lượng, cấp độ và nội dung trọng tâm.</p>
        </section>

        <section className="home-section">
          <div className="home-toolbar">
            <button type="button">Tất cả</button>
            <button type="button">Lập trình</button>
            <button type="button">Dữ liệu</button>
            <button type="button">Bảo mật</button>
          </div>

          <div className="home-card-grid courses">
            {featuredCourses.map((course) => (
              <article className="home-course-card" key={course.title}>
                <img alt={course.title} src={course.image} />
                <div>
                  <span className="home-tag">{course.category}</span>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <dl>
                    <div>
                      <dt>Thời lượng</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div>
                      <dt>Cấp độ</dt>
                      <dd>{course.level}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
