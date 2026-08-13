import HomeLayout from './HomeLayout';
import { featuredCourses } from './homeContent';

export default function CoursesPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero courses">
          <p className="home-eyebrow">Danh muc dao tao</p>
          <h1>Khoa hoc Cong nghe thong tin</h1>
          <p>Cac hoc phan mau duoc to chuc theo huong thuc hanh, co thong tin thoi luong, cap do va noi dung trong tam.</p>
        </section>

        <section className="home-section">
          <div className="home-toolbar">
            <button type="button">Tat ca</button>
            <button type="button">Lap trinh</button>
            <button type="button">Du lieu</button>
            <button type="button">Bao mat</button>
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
                      <dt>Thoi luong</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div>
                      <dt>Cap do</dt>
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
