const courseImage = ({ title, subtitle, icon, from, to, accent = '#0f6eb8' }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${from}" offset="0"/>
          <stop stop-color="${to}" offset="1"/>
        </linearGradient>
        <pattern id="dots" width="42" height="42" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3" fill="rgba(255,255,255,.22)"/>
        </pattern>
      </defs>
      <rect width="960" height="540" rx="34" fill="url(#bg)"/>
      <rect width="960" height="540" fill="url(#dots)"/>
      <circle cx="780" cy="116" r="120" fill="rgba(255,255,255,.16)"/>
      <circle cx="164" cy="410" r="96" fill="rgba(255,255,255,.13)"/>
      <rect x="92" y="92" width="224" height="224" rx="46" fill="rgba(255,255,255,.9)"/>
      <text x="204" y="242" text-anchor="middle" font-family="Arial, sans-serif" font-size="104">${icon}</text>
      <rect x="372" y="132" width="394" height="28" rx="14" fill="rgba(255,255,255,.36)"/>
      <rect x="372" y="184" width="284" height="24" rx="12" fill="rgba(255,255,255,.28)"/>
      <rect x="372" y="248" width="434" height="132" rx="30" fill="rgba(255,255,255,.86)"/>
      <text x="408" y="308" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#123b63">${title}</text>
      <text x="408" y="356" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#63748a">${subtitle}</text>
      <rect x="408" y="394" width="154" height="12" rx="6" fill="${accent}"/>
    </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const navItems = [
  { label: 'TRANG CHỦ', path: '/' },
  { label: 'GIỚI THIỆU', path: '/gioi-thieu' },
  { label: 'HỌC PHẦN', path: '/khoa-hoc' },
  { label: 'TIN TỨC', path: '/tin-tuc' },
  { label: 'LIÊN HỆ', path: '/lien-he' },
];

export const featuredCourses = [
  {
    title: 'Lập trình Web',
    category: 'Web',
    duration: '12 tuần',
    level: 'Cơ bản đến nâng cao',
    image: courseImage({ title: 'Web Development', subtitle: 'HTML, CSS, React, API', icon: '💻', from: '#0f6eb8', to: '#1db7a6' }),
    description: 'Xây dựng giao diện hiện đại, API và quy trình triển khai ứng dụng web.',
  },
  {
    title: 'Frontend React',
    category: 'Web',
    duration: '8 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'React UI', subtitle: 'Component, State, Router', icon: '⚛️', from: '#2563eb', to: '#7c3aed' }),
    description: 'Thiết kế giao diện tương tác, quản lý state và tối ưu trải nghiệm người dùng.',
  },
  {
    title: 'Backend Spring Boot',
    category: 'Web',
    duration: '10 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Backend API', subtitle: 'REST, Auth, Services', icon: '🧩', from: '#0f766e', to: '#84cc16' }),
    description: 'Xây dựng API, phân quyền, xử lý nghiệp vụ và kết nối cơ sở dữ liệu.',
  },
  {
    title: 'Lập trình Mobile Flutter',
    category: 'App',
    duration: '10 tuần',
    level: 'Cơ bản đến trung cấp',
    image: courseImage({ title: 'Mobile App', subtitle: 'Flutter, UI, Firebase', icon: '📱', from: '#0284c7', to: '#22c55e' }),
    description: 'Phát triển ứng dụng di động đa nền tảng với giao diện đẹp và dữ liệu thời gian thực.',
  },
  {
    title: 'Phát triển Android',
    category: 'App',
    duration: '9 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Android', subtitle: 'Kotlin, API, Storage', icon: '🤖', from: '#16a34a', to: '#facc15' }),
    description: 'Xây dựng ứng dụng Android, xử lý vòng đời màn hình, lưu trữ và gọi API.',
  },
  {
    title: 'Nhập môn Trí tuệ nhân tạo',
    category: 'AI',
    duration: '14 tuần',
    level: 'Nâng cao',
    image: courseImage({ title: 'Artificial Intelligence', subtitle: 'Search, ML, Prediction', icon: '🧠', from: '#7c3aed', to: '#ef4444' }),
    description: 'Nền tảng học máy, xử lý dữ liệu và ứng dụng AI trong sản phẩm số.',
  },
  {
    title: 'Machine Learning căn bản',
    category: 'AI',
    duration: '12 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Machine Learning', subtitle: 'Model, Training, Metrics', icon: '📊', from: '#0891b2', to: '#f59e0b' }),
    description: 'Huấn luyện mô hình, đánh giá chất lượng và áp dụng thuật toán vào dữ liệu thực tế.',
  },
  {
    title: 'Deep Learning ứng dụng',
    category: 'AI',
    duration: '12 tuần',
    level: 'Nâng cao',
    image: courseImage({ title: 'Deep Learning', subtitle: 'Neural Network, Vision, NLP', icon: '🔬', from: '#4f46e5', to: '#db2777' }),
    description: 'Tìm hiểu mạng nơ-ron, mô hình thị giác máy tính và xử lý ngôn ngữ tự nhiên.',
  },
  {
    title: 'Hệ quản trị CSDL',
    category: 'Dữ liệu',
    duration: '10 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Database', subtitle: 'SQL, Design, Optimize', icon: '🗄️', from: '#334155', to: '#0ea5e9' }),
    description: 'Thiết kế, truy vấn, tối ưu và quản lý cơ sở dữ liệu cho hệ thống giáo dục.',
  },
  {
    title: 'Phân tích dữ liệu với Python',
    category: 'Dữ liệu',
    duration: '9 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Data Analysis', subtitle: 'Python, Pandas, Chart', icon: '📈', from: '#0d9488', to: '#f97316' }),
    description: 'Làm sạch, phân tích, trực quan hóa dữ liệu và xây dựng báo cáo phục vụ ra quyết định.',
  },
  {
    title: 'An toàn thông tin',
    category: 'Bảo mật',
    duration: '9 tuần',
    level: 'Trung cấp',
    image: courseImage({ title: 'Cyber Security', subtitle: 'Risk, Defense, Audit', icon: '🛡️', from: '#111827', to: '#dc2626' }),
    description: 'Nhận diện rủi ro, bảo vệ dữ liệu và vận hành hệ thống an toàn.',
  },
  {
    title: 'Bảo mật ứng dụng Web',
    category: 'Bảo mật',
    duration: '8 tuần',
    level: 'Nâng cao',
    image: courseImage({ title: 'Web Security', subtitle: 'OWASP, Auth, Testing', icon: '🔐', from: '#7f1d1d', to: '#f59e0b' }),
    description: 'Phòng chống lỗ hổng phổ biến, kiểm thử bảo mật và bảo vệ luồng đăng nhập.',
  },
];

export const latestNews = [
  {
    title: 'Triển khai hệ thống quản lý học tập mới cho năm học 2026-2027',
    date: '12/08/2026',
    tag: 'Thông báo',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCd3ZberxXrR0engDYmi2iXXgRwYA6Vr543Y1xzx4lc9xlW9cq7wP2DuQ92-Q-0EXqwP9ZEdqn5qEmUATpunwkZWv78xIYlKcae5qGzDNWXyNInu1xtbchHNbVGS1y9AST0p1WrdnEQG6OHe1T3Rza1MiWz1nMNPE_vrD09yNrOut_j8pAEzrjn7ucRdcveVcToxosST_DePd8ayIrjTMiVUTl-0na2_jlhk4MZZUnSLyFy3in_hXoH',
    summary: 'EduLMS cập nhật công cụ lớp học, bài tập, nộp bài và theo dõi tiến độ trên một màn hình.',
  },
  {
    title: 'Lịch hướng dẫn sử dụng cổng thông tin sinh viên',
    date: '20/08/2026',
    tag: 'Hướng dẫn',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJmHECMEyisWULqhU1od_5wEwUBmedP8VnOYjFtTSlUrJwwCxguSyJQoJPPK95PIo8bSPJ6OwXIZcJLISNpDuZn8HC4AYNXHI2acXQhOoJdWDyfVFPulokrlCiUNEUDpgQUAjjfZSSG5OUpv-XCUnMNzwnAOD_F9q48HbSbNhL_DVgtNm5TSjN61ZS-VWBf5dVQQ1b7sCW6txIw7UVbHQUFEzk82DNsIfCiC6jckWuOLXrTenOQQo0',
    summary: 'Sinh viên được hướng dẫn đăng nhập, nhận bài tập, nộp bài và xem điểm trực tuyến.',
  },
  {
    title: 'Bổ sung tài liệu học tập và video bài giảng',
    date: '28/08/2026',
    tag: 'Học liệu',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvvKLJWdWxNEE0_rZAKcB0xOJfUFaxoMS3yU6-o9PRXAhX_FgnSGGTeKzsIUswEkGLNLHsGvs_OYqE0v4MyQ6pjmGvKhQKDwdFJnVUjvuB1wH2t3oN_cBjT-uwMSX0r9tuiR7_vaGtUpdgOBNz6EAhZTSLHepiMZVrbcGeu5FOQxZAv3IeQapmOtMkBLY5N4rY9bZB8Pq5VWVBSFXUdB2AICtCzt9qTjToWVilDPisUutpAm8kelCU',
    summary: 'Kho học liệu được tổ chức theo môn học, giúp giảng viên và sinh viên tìm nhanh nội dung cần thiết.',
  },
];

export const supportChannels = [
  {
    title: 'Văn phòng hỗ trợ',
    value: 'Phòng A.101, cơ sở chính',
    detail: 'Tiếp nhận yêu cầu học vụ trong giờ hành chính.',
  },
  {
    title: 'Hotline học vụ',
    value: '028 1234 5678',
    detail: 'Hỗ trợ lịch học, lớp học, bài tập và điểm số.',
  },
  {
    title: 'Hỗ trợ kỹ thuật LMS',
    value: 'support@edulms.edu.vn',
    detail: 'Xử lý sự cố đăng nhập, nộp bài và tài liệu trực tuyến.',
  },
];
