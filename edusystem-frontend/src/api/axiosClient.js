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
    if (error.response && error.response.status === 401) {
      // Bị từ chối quyền -> Xóa token cũ và có thể đá về trang Đăng nhập
      console.error("Token hết hạn hoặc không hợp lệ!");
      localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;