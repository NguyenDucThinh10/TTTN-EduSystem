import HomeLayout from './HomeLayout';

const values = [
  'So hoa quy trinh giao day va hoc tap',
  'Minh bach diem so, phan hoi va tien do hoc tap',
  'Ho tro giang vien quan ly lop hoc nhanh gon',
  'Tang trai nghiem tu hoc cho sinh vien',
];

export default function AboutPage({ user, onLogout }) {
  return (
    <HomeLayout user={user} onLogout={onLogout}>
      <main>
        <section className="home-page-hero about">
          <p className="home-eyebrow">Gioi thieu</p>
          <h1>Ve EduLMS</h1>
          <p>EduLMS la nen tang giao duc so chuyen nghiep, ho tro nha truong quan ly hoc phan, bai tap, nop bai va danh gia ket qua hoc tap.</p>
        </section>

        <section className="home-section home-split">
          <div>
            <p className="home-eyebrow">Tam nhin</p>
            <h2>Nen tang hoc tap dong bo cho moi vai tro</h2>
            <p>
              He thong duoc dinh huong de giam thao tac thu cong, giup giang vien tap trung vao chat luong giang day va giup sinh vien nam ro tien do cua minh.
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
            <h3>Tao lop va giao bai</h3>
            <p>Giang vien tao hoc phan, mo bai tap va thiet lap han nop.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Nop bai va phan hoi</h3>
            <p>Sinh vien gui bai lam, xem trang thai va nhan gop y truc tiep.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Theo doi ket qua</h3>
            <p>Diem so va thong ke giup cac ben nam bat tien do hoc tap.</p>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
