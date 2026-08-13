import HomeLayout from './HomeLayout';
import { supportChannels } from './homeContent';

export default function ContactPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero contact">
          <p className="home-eyebrow">Ho tro nguoi dung</p>
          <h1>Lien he ho tro</h1>
          <p>Gui yeu cau ho tro ve tai khoan, lop hoc, bai tap, nop bai hoac diem so. Bo phan phu trach se phan hoi theo kenh phu hop.</p>
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
            <h2>Gui yeu cau ho tro</h2>
            <label>
              Ho va ten
              <input placeholder="Nhap ho ten" type="text" />
            </label>
            <label>
              Email
              <input placeholder="name@example.com" type="email" />
            </label>
            <label>
              Noi dung
              <textarea placeholder="Mo ta van de can ho tro" rows="5" />
            </label>
            <button type="button">Gui yeu cau</button>
          </form>
        </section>

        <section className="home-section home-map-panel">
          <div>
            <p className="home-eyebrow">Co so truc thuoc</p>
            <h2>Ban do co so</h2>
            <p>Phong ho tro dat tai khu hanh chinh cua co so chinh. Sinh vien co the den truc tiep hoac gui yeu cau qua email.</p>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
