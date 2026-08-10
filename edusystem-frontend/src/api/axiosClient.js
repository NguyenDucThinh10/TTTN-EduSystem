import axios from 'axios';

// Khởi tạo một bản sao của Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // Trỏ thẳng vào cổng Backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Trước khi gửi bất kỳ request nào đi, hãy chạy vào đây
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token thì tự động nhét vào Header Authorization
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
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Khi nhận response từ Server về, nếu lỗi 401 (hết hạn token) thì xử lý
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ lấy phần data, bỏ qua các config thừa của Axios
  },
  (error) => {
    // Xử lý lỗi 401 (Chưa đăng nhập hoặc Token giả/hết hạn)
    if (error.response && error.response.status === 401) {
      console.error("Token hết hạn hoặc không hợp lệ!");
      
      // [BỔ SUNG] Dọn sạch két sắt khi bị đá ra ngoài
      localStorage.removeItem('token');
      localStorage.removeItem('role'); 
      localStorage.removeItem('username'); 
      
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
  }
);

export default axiosClient;