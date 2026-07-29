CREATE DATABASE IF NOT EXISTS edulms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edulms_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
  status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  credits INT NOT NULL
);

CREATE TABLE classes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  semester VARCHAR(255),
  status ENUM('ONGOING', 'COMPLETED') DEFAULT 'ONGOING',
  CONSTRAINT fk_classes_course
    FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_classes_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_enrollments_class
    FOREIGN KEY (class_id) REFERENCES classes(id),
  CONSTRAINT fk_enrollments_student
    FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT uk_enrollment_class_student
    UNIQUE (class_id, student_id)
);

CREATE TABLE materials (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(255),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_materials_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(255),
  due_date DATETIME,
  max_score DOUBLE NOT NULL DEFAULT 10,
  weight DOUBLE NOT NULL DEFAULT 1,
  CONSTRAINT fk_assignments_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assignment_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  file_url VARCHAR(255),
  submitted_at DATETIME,
  is_late BOOLEAN NOT NULL DEFAULT FALSE,
  score DOUBLE,
  feedback TEXT,
  graded_at DATETIME,
  CONSTRAINT fk_submissions_assignment
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  CONSTRAINT fk_submissions_student
    FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT uk_submission_assignment_student
    UNIQUE (assignment_id, student_id)
);

INSERT INTO users (id, username, password_hash, full_name, role, status) VALUES
  (1, 'admin', '$2a$10$spWksaOF2vEAV/aRBpRtIuZib0ovTLVJ7On62uF4qqMo3bm7ZC47a', 'System Admin', 'ADMIN', 'ACTIVE'),
  (2, 'teacher', '$2a$10$bMZ5348hyETVxRYnSzo2Ue.PZx4eV1yIvfEYHZ8HxM1Cenk5QwI/O', 'John Doe', 'TEACHER', 'ACTIVE'),
  (3, 'student1', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Alice Smith', 'STUDENT', 'ACTIVE'),
  (4, 'student2', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Bob Johnson', 'STUDENT', 'ACTIVE');

INSERT INTO courses (id, code, title, credits) VALUES
  (1, 'CS101', 'Nhap mon lap trinh', 3),
  (2, 'SE302', 'Cong nghe phan mem', 4),
  (3, 'DB201', 'Co so du lieu', 3);

INSERT INTO classes (id, course_id, teacher_id, name, semester, status) VALUES
  (1, 1, 2, 'CS101-01', 'HK1 2026-2027', 'ONGOING'),
  (2, 2, 2, 'SE302-02', 'HK1 2026-2027', 'ONGOING'),
  (3, 3, 2, 'DB201-01', 'HK1 2026-2027', 'ONGOING');

INSERT INTO enrollments (class_id, student_id, enrolled_at) VALUES
  (1, 3, NOW()),
  (1, 4, NOW()),
  (2, 3, NOW()),
  (3, 4, NOW());

INSERT INTO materials (class_id, title, file_url, file_type, is_visible) VALUES
  (1, 'Slide chuong 1 - Tong quan lap trinh', '/uploads/materials/cs101-chuong-1.pdf', 'PDF', TRUE),
  (2, 'Tai lieu yeu cau phan mem', '/uploads/materials/se302-requirements.pdf', 'PDF', TRUE),
  (3, 'Mo hinh ERD mau', '/uploads/materials/db201-erd.pdf', 'PDF', TRUE);

INSERT INTO assignments (id, class_id, title, description, file_url, due_date, max_score, weight) VALUES
  (1, 1, 'Bai tap vong lap', 'Viet chuong trinh luyen tap cau truc lap va mang co ban.', NULL, DATE_ADD(NOW(), INTERVAL 7 DAY), 10, 1),
  (2, 2, 'Phan tich yeu cau', 'Lap tai lieu yeu cau cho mot he thong quan ly lop hoc.', NULL, DATE_ADD(NOW(), INTERVAL 10 DAY), 10, 1),
  (3, 3, 'Thiet ke co so du lieu', 'Ve ERD va chuyen sang mo hinh quan he.', NULL, DATE_ADD(NOW(), INTERVAL 12 DAY), 10, 1);

INSERT INTO submissions (assignment_id, student_id, file_url, submitted_at, is_late, score, feedback, graded_at) VALUES
  (1, 3, '/uploads/submissions/student1-loop.pdf', NOW(), FALSE, 8.5, 'Bai lam tot, can toi uu ten bien.', NOW()),
  (2, 3, '/uploads/submissions/student1-requirements.pdf', NOW(), FALSE, NULL, NULL, NULL),
  (1, 4, '/uploads/submissions/student2-loop.pdf', NOW(), FALSE, 7.5, 'Dung yeu cau, can bo sung giai thich.', NOW());
