import { useMemo, useState } from 'react';
import HomeLayout from './HomeLayout';
import { featuredSubjects } from './homeContent';

const allFilter = 'Tất cả';
const subjectFilters = [allFilter, 'AI', 'Web', 'App', 'Dữ liệu', 'Bảo mật'];

export default function SubjectsPage({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState(allFilter);
  const visibleSubjects = useMemo(() => {
    if (activeFilter === allFilter) return featuredSubjects;
    return featuredSubjects.filter((subject) => subject.category === activeFilter);
  }, [activeFilter]);

  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero subjects">
          <p className="home-eyebrow">Danh mục đào tạo</p>
          <h1>Ngành Công nghệ thông tin</h1>
          <p>Các học phần mẫu được tổ chức theo chuyên ngành AI, Web, App, Dữ liệu và Bảo mật, có thông tin thời lượng, cấp độ và nội dung trọng tâm.</p>
        </section>

        <section className="home-section">
          <div className="home-toolbar" role="tablist" aria-label="Lọc học phần theo chuyên ngành">
            {subjectFilters.map((filter) => (
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

          <div className="home-card-grid subjects">
            {visibleSubjects.map((subject) => (
              <article className="home-subject-card" key={subject.title}>
                <img alt={subject.title} src={subject.image} />
                <div>
                  <span className="home-tag">{subject.category}</span>
                  <h2>{subject.title}</h2>
                  <p>{subject.description}</p>
                  <dl>
                    <div>
                      <dt>Thời lượng</dt>
                      <dd>{subject.duration}</dd>
                    </div>
                    <div>
                      <dt>Cấp độ</dt>
                      <dd>{subject.level}</dd>
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
