-- EduSystem MySQL database schema and demo data
-- Import with:
-- mysql -u root -p < database-edulms-full.sql

CREATE DATABASE IF NOT EXISTS edulms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edulms_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;
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

CREATE TABLE materials (
  id BIGINT NOT NULL AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(255) DEFAULT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_materials_class_id (class_id),
  CONSTRAINT fk_materials_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE
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

INSERT INTO users (id, username, email, password_hash, full_name, role, status) VALUES
  (1, 'admin', 'admin@edulms.local', '$2a$10$spWksaOF2vEAV/aRBpRtIuZib0ovTLVJ7On62uF4qqMo3bm7ZC47a', 'System Admin', 'ADMIN', 'ACTIVE'),
  (2, 'teacher', 'teacher@edulms.local', '$2a$10$bMZ5348hyETVxRYnSzo2Ue.PZx4eV1yIvfEYHZ8HxM1Cenk5QwI/O', 'Teacher Demo', 'TEACHER', 'ACTIVE'),
  (3, 'student', 'student@edulms.local', '$2a$10$0pb/g8krAYiINpdSks0jQOY0YuwEqzMxPlXCI.mIUjvi/.j3y7l1O', 'Student Demo', 'STUDENT', 'ACTIVE');

INSERT INTO courses (id, code, title, credits) VALUES
  (1, 'CS101', 'Nhap mon lap trinh', 3),
  (2, 'SE302', 'Cong nghe phan mem', 4),
  (3, 'DB201', 'Co so du lieu', 3);

INSERT INTO classes (id, course_id, teacher_id, name, semester, status) VALUES
  (1, 1, 2, 'CS101-01', 'HK1 2026-2027', 'ONGOING'),
  (2, 2, 2, 'SE302-02', 'HK1 2026-2027', 'ONGOING'),
  (3, 3, 2, 'DB201-01', 'HK1 2026-2027', 'ONGOING');

INSERT INTO enrollments (id, class_id, student_id, enrolled_at) VALUES
  (1, 1, 3, '2026-07-30 13:13:39'),
  (2, 2, 3, '2026-07-30 13:13:39'),
  (3, 3, 3, '2026-07-30 13:13:39');

INSERT INTO materials (id, class_id, title, file_url, file_type, is_visible) VALUES
  (1, 1, 'Slide chuong 1 - Tong quan lap trinh', '/uploads/materials/cs101-chuong-1.pdf', 'PDF', 1),
  (2, 2, 'Tai lieu yeu cau phan mem', '/uploads/materials/se302-requirements.pdf', 'PDF', 1),
  (3, 3, 'Mo hinh ERD mau', '/uploads/materials/db201-erd.pdf', 'PDF', 1);

INSERT INTO assignments (id, class_id, title, description, file_url, due_date, max_score, weight, status, created_at) VALUES
  (1, 1, 'Bai tap vong lap', 'Viet chuong trinh luyen tap cau truc lap va mang co ban.', '/uploads/assignments/cs101-loop.pdf', '2026-08-20 23:59:00', 10, 1, 'PUBLISHED', '2026-07-30 13:20:47.606531'),
  (2, 2, 'Phan tich yeu cau', 'Lap tai lieu yeu cau cho mot he thong quan ly lop hoc.', '/uploads/assignments/se302-requirements.pdf', '2026-08-23 23:59:00', 10, 1, 'PUBLISHED', '2026-07-30 13:20:47.606531'),
  (3, 3, 'Thiet ke co so du lieu', 'Ve ERD va chuyen sang mo hinh quan he.', '/uploads/assignments/db201-erd.pdf', '2026-08-25 23:59:00', 10, 1, 'PUBLISHED', '2026-07-30 13:20:47.606531');

INSERT INTO submissions (id, assignment_id, student_id, file_url, submitted_at, is_late, score, feedback, graded_at, status) VALUES
  (1, 1, 3, '/uploads/submissions/student-loop.pdf', '2026-08-12 09:30:00', 0, 8.5, 'Bai lam tot, can toi uu ten bien.', '2026-08-13 10:00:00', 'GRADED'),
  (2, 2, 3, '/uploads/submissions/student-requirements.pdf', '2026-08-13 08:00:00', 0, NULL, NULL, NULL, 'SUBMITTED');

INSERT INTO grades (id, feedback, graded_at, graded_by, score, submission_id) VALUES
  (1, 'Bai lam tot, can toi uu ten bien.', '2026-08-13 10:00:00.000000', 'teacher', 8.5, 1);

ALTER TABLE users AUTO_INCREMENT = 4;
ALTER TABLE courses AUTO_INCREMENT = 4;
ALTER TABLE classes AUTO_INCREMENT = 4;
ALTER TABLE enrollments AUTO_INCREMENT = 4;
ALTER TABLE materials AUTO_INCREMENT = 4;
ALTER TABLE assignments AUTO_INCREMENT = 4;
ALTER TABLE submissions AUTO_INCREMENT = 3;
ALTER TABLE grades AUTO_INCREMENT = 2;
