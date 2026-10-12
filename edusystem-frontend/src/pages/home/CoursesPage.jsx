import { useMemo, useState } from 'react';
import HomeLayout from './HomeLayout';
import { featuredCourses } from './homeContent';

const allFilter = 'Tất cả';
const courseFilters = [allFilter, 'AI', 'Web', 'App', 'Dữ liệu', 'Bảo mật'];

export default function CoursesPage({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState(allFilter);
  const visibleCourses = useMemo(() => {
    if (activeFilter === allFilter) return featuredCourses;
    return featuredCourses.filter((course) => course.category === activeFilter);
  }, [activeFilter]);

  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero courses">
          <p className="home-eyebrow">Danh mục đào tạo</p>
          <h1>Ngành Công nghệ thông tin</h1>
          <p>Các học phần mẫu được tổ chức theo chuyên ngành AI, Web, App, Dữ liệu và Bảo mật, có thông tin thời lượng, cấp độ và nội dung trọng tâm.</p>
        </section>

        <section className="home-section">
          <div className="home-toolbar" role="tablist" aria-label="Lọc học phần theo chuyên ngành">
            {courseFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="home-card-grid courses">
            {visibleCourses.map((course) => (
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
