import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // [THÊM MỚI] Chuẩn bị cho task: Upload Danh sách Sinh viên (Excel) và Nộp bài (File)
    // Nếu dữ liệu gửi đi là một file (FormData), ta phải gỡ 'application/json' để trình duyệt tự nhận diện 'multipart/form-data'
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {

    // Xử lý lỗi 401 (Chưa đăng nhập hoặc Token giả/hết hạn)
    if (error.response && error.response.status === 401) {
      console.error("Token hết hạn hoặc không hợp lệ!");
      
      // [BỔ SUNG] Dọn sạch két sắt khi bị đá ra ngoài
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user'); 
      localStorage.removeItem('username'); 
      localStorage.removeItem('fullName');
      
      // [BẬT LÊN & SỬA ĐƯỜNG DẪN] Đá về đúng trang AuthPage của bạn
      window.location.href = '/auth'; 
    }

    // [THÊM MỚI] Xử lý lỗi 403 (Phân quyền)
    // Dành cho trường hợp Sinh viên (STUDENT) cố tình gọi API của Quản trị viên (ADMIN)
    if (error.response && error.response.status === 403) {
        console.error("Bạn không có đủ thẩm quyền thực hiện hành động này!");
        // (Tùy chọn) Có thể bắn một thông báo lỗi màu đỏ góc màn hình tại đây sau này
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
