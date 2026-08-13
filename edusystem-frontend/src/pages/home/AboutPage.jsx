import HomeLayout from './HomeLayout';

const values = [
  'Số hóa quy trình giảng dạy và học tập',
  'Minh bạch điểm số, phản hồi và tiến độ học tập',
  'Hỗ trợ giảng viên quản lý lớp học nhanh gọn',
  'Tăng trải nghiệm tự học cho sinh viên',
];

export default function AboutPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero about">
          <p className="home-eyebrow">Giới thiệu</p>
          <h1>Về EduLMS</h1>
          <p>EduLMS là nền tảng giáo dục số chuyên nghiệp, hỗ trợ nhà trường quản lý học phần, bài tập, nộp bài và đánh giá kết quả học tập.</p>
        </section>

        <section className="home-section home-split">
          <div>
            <p className="home-eyebrow">Tầm nhìn</p>
            <h2>Nền tảng học tập đồng bộ cho mọi vai trò</h2>
            <p>
              Hệ thống được định hướng để giảm thao tác thủ công, giúp giảng viên tập trung vào chất lượng giảng dạy và giúp sinh viên nắm rõ tiến độ của mình.
            </p>
          </div>
          <div className="home-value-grid">
            {values.map((value) => (
              <div className="home-value" key={value}>
                {value}
              </div>
            ))}
          </div>
        </section>

        <section className="home-section home-process">
          <div>
            <span>01</span>
            <h3>Tạo lớp và giao bài</h3>
            <p>Giảng viên tạo học phần, mở bài tập và thiết lập hạn nộp.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Nộp bài và phản hồi</h3>
            <p>Sinh viên gửi bài làm, xem trạng thái và nhận góp ý trực tiếp.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Theo dõi kết quả</h3>
            <p>Điểm số và thống kê giúp các bên nắm bắt tiến độ học tập.</p>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
