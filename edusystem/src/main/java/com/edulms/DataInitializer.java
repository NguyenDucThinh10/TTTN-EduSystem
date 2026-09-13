package com.edulms;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;
import com.edulms.entity.Course;
import com.edulms.entity.Enrollment;
import com.edulms.entity.Material;
import com.edulms.entity.Role;
import com.edulms.entity.Schedule;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.MaterialRepository;
import com.edulms.repository.ScheduleRepository;
import com.edulms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MaterialRepository materialRepository;
    private final ScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() != 0) {
            return;
        }

        User admin = user("admin", "123456", "Nguyễn Đức Thịnh", "thinh.admin@edulms.com", Role.ADMIN);
        User teacher = user("teacher1", "123456", "Nguyễn Đức Thịnh", "teacher1@edulms.com", Role.TEACHER);
        User teacher2 = user("teacher2", "123456", "Nguyễn Văn Minh", "teacher2@edulms.com", Role.TEACHER);
        User teacher3 = user("teacher3", "123456", "Trần Thị Thu Hà", "teacher3@edulms.com", Role.TEACHER);
        User student = user("student", "123456", "Trương Công Lý", "student@edulms.com", Role.STUDENT);
        User student2 = user("student2", "123456", "Nguyễn Hoàng Anh", "student2@edulms.com", Role.STUDENT);
        User student3 = user("student3", "123456", "Lê Đức Anh", "student3@edulms.com", Role.STUDENT);
        User student4 = user("student4", "123456", "Phạm Thảo Vy", "student4@edulms.com", Role.STUDENT);
        User student5 = user("student5", "123456", "Trần Minh Châu", "student5@edulms.com", Role.STUDENT);

        userRepository.saveAll(List.of(admin, teacher, teacher2, teacher3, student, student2, student3, student4, student5));

        Course course1 = new Course(null, "IT001", "Xây dựng phần mềm Hướng đối tượng (XDPM-OOP)", 3);
        Course course2 = new Course(null, "IT002", "Relational Database Theory", 3);
        Course course3 = new Course(null, "IT003", "Data Engineering Fundamentals", 4);
        Course it101 = new Course(null, "IT101", "Nhập môn Công nghệ thông tin", 3);
        Course it102 = new Course(null, "IT102", "Kỹ thuật lập trình", 3);
        Course it202 = new Course(null, "IT202", "Lập trình Web", 3);
        Course it303 = new Course(null, "IT303", "Cơ sở dữ liệu", 3);
        Course it304 = new Course(null, "IT304", "Phân tích thiết kế hệ thống", 3);

        courseRepository.saveAll(List.of(course1, course2, course3, it101, it102, it202, it303, it304));

        ClassEntity oopClass = new ClassEntity(null, course1, teacher, "XDPM-OOP-K1", "Học kỳ 1 - 2026", ClassStatus.ONGOING);
        ClassEntity dbClass = new ClassEntity(null, course2, teacher, "DB-Theory-K1", "Học kỳ 1 - 2026", ClassStatus.ONGOING);
        ClassEntity it101Class = new ClassEntity(null, it101, teacher, "IT101-01", "HK1 2026-2027", ClassStatus.ONGOING);
        ClassEntity it102Class = new ClassEntity(null, it102, teacher, "IT102-01", "HK1 2026-2027", ClassStatus.ONGOING);
        ClassEntity it202Class = new ClassEntity(null, it202, teacher, "IT202-01", "HK1 2026-2027", ClassStatus.ONGOING);
        ClassEntity it303Class = new ClassEntity(null, it303, teacher2, "IT303-01", "HK1 2026-2027", ClassStatus.ONGOING);
        ClassEntity it304Class = new ClassEntity(null, it304, teacher3, "IT304-01", "HK1 2026-2027", ClassStatus.ONGOING);

        classRepository.saveAll(List.of(oopClass, dbClass, it101Class, it102Class, it202Class, it303Class, it304Class));

        enrollmentRepository.saveAll(List.of(
                enrollment(it101Class, student),
                enrollment(it102Class, student),
                enrollment(it202Class, student),
                enrollment(it303Class, student),
                enrollment(it304Class, student),
                enrollment(oopClass, student),
                enrollment(oopClass, student2),
                enrollment(oopClass, student3),
                enrollment(oopClass, student4),
                enrollment(dbClass, student),
                enrollment(dbClass, student5)
        ));

        materialRepository.saveAll(List.of(
                material(it101Class, teacher, "Slide chương 1 - Tổng quan Công nghệ thông tin",
                        "Tài liệu giới thiệu tổng quan về ngành Công nghệ thông tin.",
                        "tong-quan-cntt.pdf", "/uploads/materials/tong-quan-cntt.pdf"),
                material(it102Class, teacher, "Tài liệu kỹ thuật lập trình C++",
                        "Tài liệu hướng dẫn cấu trúc điều kiện, vòng lặp và mảng trong C++.",
                        "ky-thuat-lap-trinh-cpp.pdf", "/uploads/materials/ky-thuat-lap-trinh-cpp.pdf"),
                material(it202Class, teacher, "Tài liệu HTML, CSS và JavaScript",
                        "Tài liệu phục vụ học phần lập trình web.",
                        "html-css-javascript.pdf", "/uploads/materials/html-css-javascript.pdf")
        ));
        scheduleRepository.saveAll(List.of(
                schedule(it101Class, DayOfWeek.MONDAY, "07:30", "09:30", "P101", "Nhập môn Công nghệ thông tin", "Buổi học lý thuyết"),
                schedule(it102Class, DayOfWeek.TUESDAY, "09:45", "11:45", "P202", "Kỹ thuật lập trình", "Thực hành lập trình C++"),
                schedule(it202Class, DayOfWeek.WEDNESDAY, "13:30", "15:30", "LAB01", "Lập trình Web", "Thực hành HTML, CSS, JavaScript"),
                schedule(it303Class, DayOfWeek.THURSDAY, "07:30", "09:30", "P305", "Cơ sở dữ liệu", "Học về mô hình ERD và SQL"),
                schedule(it304Class, DayOfWeek.FRIDAY, "15:45", "17:45", "P401", "Phân tích thiết kế hệ thống", "Thảo luận bài tập nhóm")
        ));

        System.out.println("====== MOCK DATA INITIALIZED SUCCESSFULLY ======");
    }

    private User user(String username, String password, String fullName, String email, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        return user;
    }

    private Enrollment enrollment(ClassEntity classEntity, User student) {
        Enrollment enrollment = new Enrollment();
        enrollment.setClassEntity(classEntity);
        enrollment.setStudent(student);
        enrollment.setEnrolledAt(LocalDateTime.now());
        return enrollment;
    }

    private Material material(ClassEntity classEntity, User uploader, String title, String description, String fileName, String fileUrl) {
        Material material = new Material();
        material.setClassEntity(classEntity);
        material.setUploader(uploader);
        material.setTitle(title);
        material.setDescription(description);
        material.setFileName(fileName);
        material.setFileUrl(fileUrl);
        material.setFileType("PDF");
        material.setIsVisible(true);
        material.setUploadedAt(LocalDateTime.now());
        return material;
    }
    private Schedule schedule(ClassEntity classEntity, DayOfWeek dayOfWeek, String startTime, String endTime,
            String room, String subject, String note) {
        Schedule schedule = new Schedule();
        schedule.setClassEntity(classEntity);
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(LocalTime.parse(startTime));
        schedule.setEndTime(LocalTime.parse(endTime));
        schedule.setRoom(room);
        schedule.setSubject(subject);
        schedule.setNote(note);
        return schedule;
    }
}
