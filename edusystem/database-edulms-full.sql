-- EduSystem MySQL database schema and demo data
-- Import with:
-- mysql --default-character-set=utf8mb4 -u root -p < database-edulms-full.sql

CREATE DATABASE IF NOT EXISTS edulms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edulms_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
  status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE courses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  credits INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_courses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE classes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  semester VARCHAR(255) DEFAULT NULL,
  status ENUM('ONGOING', 'COMPLETED') DEFAULT 'ONGOING',
  PRIMARY KEY (id),
  KEY idx_classes_course_id (course_id),
  KEY idx_classes_teacher_id (teacher_id),
  CONSTRAINT fk_classes_course
    FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_classes_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE enrollments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_enrollment_class_student (class_id, student_id),
  KEY idx_enrollments_student_id (student_id),
  CONSTRAINT fk_enrollments_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_student
    FOREIGN KEY (student_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE schedules (
  id BIGINT NOT NULL AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(255) DEFAULT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  note VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_schedules_class_id (class_id),
  CONSTRAINT fk_schedules_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE materials (
  id BIGINT NOT NULL AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  uploader_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(255) DEFAULT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  uploaded_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_materials_class_id (class_id),
  KEY idx_materials_uploader_id (uploader_id),
  CONSTRAINT fk_materials_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_materials_uploader
    FOREIGN KEY (uploader_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assignments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  file_url VARCHAR(255) DEFAULT NULL,
  due_date DATETIME DEFAULT NULL,
  max_score DOUBLE NOT NULL DEFAULT 10,
  weight DOUBLE NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_assignments_class_id (class_id),
  CONSTRAINT fk_assignments_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE submissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  assignment_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  file_url VARCHAR(255) DEFAULT NULL,
  submitted_at DATETIME DEFAULT NULL,
  is_late TINYINT(1) NOT NULL DEFAULT 0,
  score DOUBLE DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  graded_at DATETIME DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
  PRIMARY KEY (id),
  UNIQUE KEY uk_submission_assignment_student (assignment_id, student_id),
  KEY idx_submissions_student_id (student_id),
  CONSTRAINT fk_submissions_assignment
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_submissions_student
    FOREIGN KEY (student_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grades (
  id BIGINT NOT NULL AUTO_INCREMENT,
  feedback TEXT DEFAULT NULL,
  graded_at DATETIME(6) NOT NULL,
  graded_by VARCHAR(255) NOT NULL,
  score DOUBLE NOT NULL,
  submission_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_grades_submission_id (submission_id),
  CONSTRAINT fk_grades_submission
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- All demo accounts use the same sample BCrypt password hash as the original SQL file.
INSERT INTO users (id, username, email, password_hash, full_name, role, status) VALUES
  (1, 'admin', 'thinh.admin@edulms.com', '$2a$10$spWksaOF2vEAV/aRBpRtIuZib0ovTLVJ7On62uF4qqMo3bm7ZC47a', 'Nguyễn Đức Thịnh', 'ADMIN', 'ACTIVE'),
  (2, 'teacher1', 'teacher1@edulms.com', '$2a$10$bMZ5348hyETVxRYnSzo2Ue.PZx4eV1yIvfEYHZ8HxM1Cenk5QwI/O', 'Nguyễn Đức Thịnh', 'TEACHER', 'ACTIVE'),
  (3, 'teacher2', 'teacher2@edulms.com', '$2a$10$bMZ5348hyETVxRYnSzo2Ue.PZx4eV1yIvfEYHZ8HxM1Cenk5QwI/O', 'Nguyễn Văn Minh', 'TEACHER', 'ACTIVE'),
  (4, 'teacher3', 'teacher3@edulms.com', '$2a$10$bMZ5348hyETVxRYnSzo2Ue.PZx4eV1yIvfEYHZ8HxM1Cenk5QwI/O', 'Trần Thị Thu Hà', 'TEACHER', 'ACTIVE'),
  (5, 'student', 'student@edulms.com', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Trương Công Lý', 'STUDENT', 'ACTIVE'),
  (6, 'student2', 'student2@edulms.com', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Nguyễn Hoàng Anh', 'STUDENT', 'ACTIVE'),
  (7, 'student3', 'student3@edulms.com', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Lê Đức Anh', 'STUDENT', 'ACTIVE'),
  (8, 'student4', 'student4@edulms.com', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Phạm Thảo Vy', 'STUDENT', 'ACTIVE'),
  (9, 'student5', 'student5@edulms.com', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Trần Minh Châu', 'STUDENT', 'ACTIVE');

INSERT INTO courses (id, code, title, credits) VALUES
  (1, 'IT001', 'Xây dựng phần mềm Hướng đối tượng (XDPM-OOP)', 3),
  (2, 'IT002', 'Relational Database Theory', 3),
  (3, 'IT003', 'Data Engineering Fundamentals', 4),
  (4, 'IT101', 'Nhập môn Công nghệ thông tin', 3),
  (5, 'IT102', 'Kỹ thuật lập trình', 3),
  (6, 'IT202', 'Lập trình Web', 3),
  (7, 'IT303', 'Cơ sở dữ liệu', 3),
  (8, 'IT304', 'Phân tích thiết kế hệ thống', 3);

INSERT INTO classes (id, course_id, teacher_id, name, semester, status) VALUES
  (1, 1, 2, 'XDPM-OOP-K1', 'Học kỳ 1 - 2026', 'ONGOING'),
  (2, 2, 2, 'DB-Theory-K1', 'Học kỳ 1 - 2026', 'ONGOING'),
  (3, 4, 2, 'IT101-01', 'HK1 2026-2027', 'ONGOING'),
  (4, 5, 2, 'IT102-01', 'HK1 2026-2027', 'ONGOING'),
  (5, 6, 2, 'IT202-01', 'HK1 2026-2027', 'ONGOING'),
  (6, 7, 3, 'IT303-01', 'HK1 2026-2027', 'ONGOING'),
  (7, 8, 4, 'IT304-01', 'HK1 2026-2027', 'ONGOING');

INSERT INTO enrollments (id, class_id, student_id, enrolled_at) VALUES
  (1, 3, 5, '2026-09-01 08:00:00'),
  (2, 4, 5, '2026-09-01 08:00:00'),
  (3, 5, 5, '2026-09-01 08:00:00'),
  (4, 6, 5, '2026-09-01 08:00:00'),
  (5, 7, 5, '2026-09-01 08:00:00'),
  (6, 1, 5, '2026-09-01 08:00:00'),
  (7, 1, 6, '2026-09-01 08:00:00'),
  (8, 1, 7, '2026-09-01 08:00:00'),
  (9, 1, 8, '2026-09-01 08:00:00'),
  (10, 2, 5, '2026-09-01 08:00:00'),
  (11, 2, 9, '2026-09-01 08:00:00');

INSERT INTO schedules (id, class_id, day_of_week, start_time, end_time, room, subject, note) VALUES
  (1, 3, 'MONDAY', '07:30:00', '09:30:00', 'P101', 'Nhập môn Công nghệ thông tin', 'Buổi học lý thuyết'),
  (2, 4, 'TUESDAY', '09:45:00', '11:45:00', 'P202', 'Kỹ thuật lập trình', 'Thực hành lập trình C++'),
  (3, 5, 'WEDNESDAY', '13:30:00', '15:30:00', 'LAB01', 'Lập trình Web', 'Thực hành HTML, CSS, JavaScript'),
  (4, 6, 'THURSDAY', '07:30:00', '09:30:00', 'P305', 'Cơ sở dữ liệu', 'Học về mô hình ERD và SQL'),
  (5, 7, 'FRIDAY', '15:45:00', '17:45:00', 'P401', 'Phân tích thiết kế hệ thống', 'Thảo luận bài tập nhóm');

INSERT INTO materials (id, class_id, uploader_id, title, description, file_name, file_url, file_type, is_visible, uploaded_at) VALUES
  (1, 3, 2, 'Slide chương 1 - Tổng quan Công nghệ thông tin', 'Tài liệu giới thiệu tổng quan về ngành Công nghệ thông tin.', 'tong-quan-cntt.pdf', '/uploads/materials/tong-quan-cntt.pdf', 'PDF', 1, '2026-09-01 08:30:00'),
  (2, 4, 2, 'Tài liệu kỹ thuật lập trình C++', 'Tài liệu hướng dẫn cấu trúc điều kiện, vòng lặp và mảng trong C++.', 'ky-thuat-lap-trinh-cpp.pdf', '/uploads/materials/ky-thuat-lap-trinh-cpp.pdf', 'PDF', 1, '2026-09-01 08:30:00'),
  (3, 5, 2, 'Tài liệu HTML, CSS và JavaScript', 'Tài liệu phục vụ học phần lập trình web.', 'html-css-javascript.pdf', '/uploads/materials/html-css-javascript.pdf', 'PDF', 1, '2026-09-01 08:30:00');

INSERT INTO assignments (id, class_id, title, description, file_url, due_date, max_score, weight, status, created_at) VALUES
  (1, 3, 'Bài tập 1 - Tìm hiểu ngành CNTT', 'Viết báo cáo ngắn về các lĩnh vực trong ngành Công nghệ thông tin.', '/uploads/assignments/bt1-cntt.pdf', '2026-09-15 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (2, 4, 'Bài tập 1 - Cấu trúc điều kiện và vòng lặp', 'Viết chương trình sử dụng câu lệnh điều kiện, vòng lặp for và while.', '/uploads/assignments/bt1-lap-trinh.pdf', '2026-09-18 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (3, 5, 'Bài tập 1 - Thiết kế trang web cá nhân', 'Xây dựng trang web cá nhân bằng HTML, CSS và JavaScript.', '/uploads/assignments/bt1-web.pdf', '2026-09-20 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (4, 1, 'Bài tập 1 - Lập trình hướng đối tượng', 'Xây dựng chương trình quản lý sinh viên sử dụng lớp, đối tượng, kế thừa và đóng gói.', '/uploads/assignments/oop-bt1.pdf', '2026-09-18 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (5, 1, 'Bài tập 2 - Thiết kế sơ đồ lớp', 'Vẽ sơ đồ lớp cho hệ thống quản lý học tập và mô tả các quan hệ giữa các lớp.', '/uploads/assignments/oop-bt2-class-diagram.pdf', '2026-09-25 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (6, 1, 'Bài tập 3 - Xây dựng project Java', 'Hoàn thiện project Java theo mô hình phân lớp và nộp mã nguồn chương trình.', '/uploads/assignments/oop-bt3-java-project.pdf', '2026-10-02 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (7, 2, 'Bài tập 1 - Thiết kế ERD', 'Thiết kế biểu đồ ERD cho hệ thống quản lý đào tạo.', '/uploads/assignments/db-bt1-erd.pdf', '2026-09-22 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000'),
  (8, 2, 'Bài tập 2 - Truy vấn SQL cơ bản', 'Viết các câu lệnh SELECT, JOIN, GROUP BY để truy vấn dữ liệu.', '/uploads/assignments/db-bt2-sql.pdf', '2026-09-29 23:59:00', 10, 1, 'PUBLISHED', '2026-09-01 09:00:00.000000');

INSERT INTO submissions (id, assignment_id, student_id, file_url, submitted_at, is_late, score, feedback, graded_at, status) VALUES
  (1, 1, 5, '/uploads/submissions/student-bt1-cntt.pdf', '2026-09-10 09:30:00', 0, 8.5, 'Bài làm đầy đủ nội dung, trình bày rõ ràng.', '2026-09-11 08:00:00', 'GRADED'),
  (2, 2, 5, '/uploads/submissions/student-bt1-lap-trinh.pdf', '2026-09-16 14:20:00', 0, 9.0, 'Chương trình chạy đúng yêu cầu.', '2026-09-17 09:00:00', 'GRADED'),
  (3, 3, 5, '/uploads/submissions/student-bt1-web.pdf', '2026-09-18 16:45:00', 0, NULL, NULL, NULL, 'SUBMITTED'),
  (4, 4, 5, '/uploads/submissions/student-oop-bt1.pdf', '2026-09-15 09:30:00', 0, 8.5, 'Bài làm đúng yêu cầu, cần trình bày code rõ hơn.', '2026-09-16 08:00:00', 'GRADED'),
  (5, 4, 6, '/uploads/submissions/student2-oop-bt1.pdf', '2026-09-16 10:15:00', 0, NULL, NULL, NULL, 'SUBMITTED'),
  (6, 5, 7, '/uploads/submissions/student3-oop-bt2.pdf', '2026-09-20 14:20:00', 0, NULL, NULL, NULL, 'SUBMITTED');

INSERT INTO grades (id, feedback, graded_at, graded_by, score, submission_id) VALUES
  (1, 'Bài làm đầy đủ nội dung, trình bày rõ ràng.', '2026-09-11 08:00:00.000000', 'teacher1', 8.5, 1),
  (2, 'Chương trình chạy đúng yêu cầu.', '2026-09-17 09:00:00.000000', 'teacher1', 9.0, 2),
  (3, 'Bài làm đúng yêu cầu, cần trình bày code rõ hơn.', '2026-09-16 08:00:00.000000', 'teacher1', 8.5, 4);

ALTER TABLE users AUTO_INCREMENT = 10;
ALTER TABLE courses AUTO_INCREMENT = 9;
ALTER TABLE classes AUTO_INCREMENT = 8;
ALTER TABLE enrollments AUTO_INCREMENT = 12;
ALTER TABLE schedules AUTO_INCREMENT = 6;
ALTER TABLE materials AUTO_INCREMENT = 4;
ALTER TABLE assignments AUTO_INCREMENT = 9;
ALTER TABLE submissions AUTO_INCREMENT = 7;
ALTER TABLE grades AUTO_INCREMENT = 4;
