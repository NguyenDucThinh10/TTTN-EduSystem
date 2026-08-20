import HomeLayout from './HomeLayout';
import { supportChannels } from './homeContent';

const campusMapImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 760">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#123b63" flood-opacity=".12"/>
    </filter>
  </defs>
  <rect width="1600" height="760" fill="#f8fafc"/>
  <g stroke="#d7dee8" stroke-width="7" stroke-linecap="round" opacity=".85">
    <path d="M-40 130 C210 120 350 160 560 128 S920 98 1640 120"/>
    <path d="M-30 612 C220 590 330 632 560 598 S1060 560 1640 600"/>
    <path d="M160 0 C132 190 168 380 118 760"/>
    <path d="M1295 0 C1210 210 1268 420 1212 760"/>
    <path d="M830 0 C828 182 858 340 820 760"/>
  </g>
  <g fill="#eef2f7" stroke="#d8e0ea" stroke-width="3">
    <rect x="42" y="30" width="100" height="110" rx="8"/>
    <rect x="230" y="28" width="146" height="82" rx="8"/>
    <rect x="1396" y="34" width="132" height="104" rx="8"/>
    <rect x="90" y="254" width="132" height="130" rx="8"/>
    <rect x="1340" y="235" width="168" height="126" rx="8"/>
    <rect x="248" y="612" width="154" height="94" rx="8"/>
    <rect x="1294" y="584" width="154" height="100" rx="8"/>
  </g>
  <g fill="#fff7ed" stroke="#fed7aa" stroke-width="3" filter="url(#soft)">
    <rect x="520" y="190" width="300" height="84" rx="4"/>
    <rect x="865" y="176" width="298" height="88" rx="4"/>
    <rect x="462" y="330" width="326" height="182" rx="8"/>
    <rect x="898" y="306" width="300" height="260" rx="8"/>
    <rect x="548" y="590" width="244" height="88" rx="6"/>
  </g>
  <g fill="#2563eb" font-family="Arial, sans-serif" font-size="28" font-weight="700">
    <text x="564" y="428">Giảng đường A</text>
    <text x="535" y="535">Giảng đường B</text>
    <text x="980" y="405">Giảng đường C</text>
    <text x="980" y="555">Thư viện UTH</text>
  </g>
  <g fill="#ef7c22" font-family="Arial, sans-serif" font-size="26" font-weight="700">
    <text x="112" y="320">Bún Bò Huế</text>
    <text x="1350" y="310">Viva Star Coffee</text>
    <text x="1370" y="610">Co.opmart</text>
    <text x="238" y="655">Quán Ăn Sinh Viên</text>
  </g>
  <g fill="#64748b" font-family="Arial, sans-serif" font-size="24">
    <text x="768" y="155" transform="rotate(-5 768 155)">Đường D3</text>
    <text x="848" y="690" transform="rotate(-5 848 690)">Đường D2</text>
    <text x="1192" y="388" transform="rotate(83 1192 388)">Đường D1</text>
    <text x="128" y="540" transform="rotate(85 128 540)">Nơ Trang Long</text>
  </g>
  <g transform="translate(720 350)">
    <path d="M46 0C20 0 0 20 0 46c0 40 46 98 46 98s46-58 46-98C92 20 72 0 46 0z" fill="#ef4444" filter="url(#soft)"/>
    <circle cx="46" cy="44" r="17" fill="#991b1b"/>
  </g>
  <text x="780" y="410" fill="#b91c1c" font-family="Arial, sans-serif" font-size="31" font-weight="800">Trường Đại học</text>
  <text x="780" y="450" fill="#b91c1c" font-family="Arial, sans-serif" font-size="31" font-weight="800">Giao thông Vận tải TP. HCM (UTH)</text>
  <g fill="#0f6eb8">
    <circle cx="530" cy="388" r="18"/><circle cx="523" cy="518" r="18"/><circle cx="963" cy="383" r="18"/><circle cx="962" cy="535" r="18"/>
  </g>
</svg>
`)}`;

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
            <img className="home-campus-map" src={campusMapImage} alt="Bản đồ cơ sở UTH" />
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
