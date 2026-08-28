# TTTN-EduSystem

EduSystem là hệ thống quản lý học tập phục vụ đề tài thực tập tốt nghiệp. Hệ thống được xây dựng theo mô hình Client - Server, hỗ trợ quản lý đào tạo, lớp học, bài tập, bài nộp, điểm số, điểm danh, tài liệu học tập, thống kê và AI hỗ trợ học tập.

## Công nghệ

**Backend**

- Java 21, Spring Boot
- Spring Security, JWT
- Spring Data JPA
- MySQL
- Maven
- Apache POI, PDFBox

**Frontend**

- ReactJS, Vite
- Ant Design
- Axios
- React Router DOM
- Recharts

## Chức năng chính

**Quản trị hệ thống**

- Quản lý tài khoản người dùng.
- Quản lý học phần.
- Quản lý lớp học và danh sách người học.
- Import danh sách người học bằng Excel.
- Quản lý thời khóa biểu.
- Xem thống kê tổng quan.

**Quản lý giảng dạy**

- Xem lớp phụ trách và thời khóa biểu.
- Quản lý bài tập.
- Xem danh sách bài nộp.
- Chấm điểm và phản hồi bài làm.
- Quản lý điểm danh.
- Xem thống kê lớp học.
- Tạo câu hỏi bằng AI.

**Học tập**

- Đăng ký và hủy đăng ký học phần.
- Xem lớp học, thời khóa biểu và bài tập.
- Tải file đề bài.
- Nộp bài, nộp lại bài và hủy bài nộp.
- Xem điểm, phản hồi và tiến độ học tập.
- Thực hiện điểm danh.
- Sử dụng trợ giảng AI.

## Cấu trúc dự án

```text
TTTN-EduSystem/
├── edusystem/              # Backend Spring Boot
│   ├── src/main/java/com/edulms/
│   │   ├── config/         # Cấu hình hệ thống
│   │   ├── controller/     # REST API
│   │   ├── dto/            # Dữ liệu trao đổi
│   │   ├── entity/         # Entity cơ sở dữ liệu
│   │   ├── repository/     # Truy xuất dữ liệu
│   │   ├── security/       # JWT và phân quyền
│   │   └── service/        # Xử lý nghiệp vụ
│   ├── uploads/            # File bài tập, bài nộp
│   ├── database-edulms-full.sql
│   └── pom.xml
│
├── edusystem-frontend/     # Frontend React/Vite
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── components/     # Component dùng chung
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Giao diện theo vai trò
│   │   ├── services/       # Service gọi API
│   │   └── utils/          # Hàm tiện ích
│   └── package.json
│
└── README.md
```

## Yêu cầu môi trường

- Java 21
- Node.js và npm
- MySQL Server
- Maven hoặc Maven Wrapper

## Cấu hình cơ sở dữ liệu

Tạo database:

```sql
CREATE DATABASE edulms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cập nhật thông tin kết nối trong:

```text
edusystem/src/main/resources/application.properties
```

Ví dụ:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edulms_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

Có thể import dữ liệu mẫu từ:

```text
edusystem/database-edulms-full.sql
```

## Chạy dự án

**Backend**

```bash
cd edusystem
mvnw.cmd spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

**Frontend**

```bash
cd edusystem-frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

## Một số API chính

```text
POST   /api/auth/login
GET    /api/me

GET    /api/admin/users
GET    /api/admin/courses
GET    /api/admin/classes
GET    /api/admin/schedules

GET    /api/classes/me
GET    /api/classes/open
POST   /api/classes/{id}/register

GET    /api/assignments/class/{classId}
POST   /api/assignments

POST   /api/submissions/assignments/{assignmentId}
GET    /api/submissions/me

PUT    /api/grades/submissions/{submissionId}
GET    /api/grades/students/{studentId}/classes/{classId}

GET    /api/attendance/me
POST   /api/attendance/teacher
POST   /api/attendance/self

GET    /api/analytics/dashboard
POST   /api/ai/generate-quiz
POST   /api/ai/ask-tutor
```

## Ghi chú

- Không commit mật khẩu database hoặc API key lên repository công khai.
- Khi triển khai thực tế, nên chuyển thông tin nhạy cảm sang biến môi trường.
- Chức năng quản lý học phí và nộp học phí đang được định hướng bổ sung trong giai đoạn phát triển tiếp theo.

## Tác giả

Dự án được phát triển phục vụ đề tài thực tập tốt nghiệp: **Xây dựng hệ thống quản lý học tập EduSystem**.
