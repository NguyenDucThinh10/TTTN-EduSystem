package com.edulms;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.edulms.entity.Assignment;
import com.edulms.entity.AssignmentStatus;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;
import com.edulms.entity.Course;
import com.edulms.entity.Enrollment;
import com.edulms.entity.Grade;
import com.edulms.entity.Material;
import com.edulms.entity.Role;
import com.edulms.entity.Schedule;
import com.edulms.entity.Submission;
import com.edulms.entity.SubmissionStatus;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.AssignmentRepository;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.GradeRepository;
import com.edulms.repository.MaterialRepository;
import com.edulms.repository.ScheduleRepository;
import com.edulms.repository.SubmissionRepository;
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
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final GradeRepository gradeRepository;
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

        Assignment cnttAssignment = assignment(it101Class, "Bài tập 1 - Tìm hiểu ngành CNTT",
                "Viết báo cáo ngắn về các lĩnh vực trong ngành Công nghệ thông tin.",
                "/uploads/assignments/bt1-cntt.pdf", "2026-09-15T23:59:00");
        Assignment programmingAssignment = assignment(it102Class, "Bài tập 1 - Cấu trúc điều kiện và vòng lặp",
                "Viết chương trình sử dụng câu lệnh điều kiện, vòng lặp for và while.",
                "/uploads/assignments/bt1-lap-trinh.pdf", "2026-09-18T23:59:00");
        Assignment webAssignment = assignment(it202Class, "Bài tập 1 - Thiết kế trang web cá nhân",
                "Xây dựng trang web cá nhân bằng HTML, CSS và JavaScript.",
                "/uploads/assignments/bt1-web.pdf", "2026-09-20T23:59:00");
        Assignment oopAssignment1 = assignment(oopClass, "Bài tập 1 - Lập trình hướng đối tượng",
                "Xây dựng chương trình quản lý sinh viên sử dụng lớp, đối tượng, kế thừa và đóng gói.",
                "/uploads/assignments/oop-bt1.pdf", "2026-09-18T23:59:00");
        Assignment oopAssignment2 = assignment(oopClass, "Bài tập 2 - Thiết kế sơ đồ lớp",
                "Vẽ sơ đồ lớp cho hệ thống quản lý học tập và mô tả các quan hệ giữa các lớp.",
                "/uploads/assignments/oop-bt2-class-diagram.pdf", "2026-09-25T23:59:00");
        Assignment oopAssignment3 = assignment(oopClass, "Bài tập 3 - Xây dựng project Java",
                "Hoàn thiện project Java theo mô hình phân lớp và nộp mã nguồn chương trình.",
                "/uploads/assignments/oop-bt3-java-project.pdf", "2026-10-02T23:59:00");
        Assignment dbAssignment1 = assignment(dbClass, "Bài tập 1 - Thiết kế ERD",
                "Thiết kế biểu đồ ERD cho hệ thống quản lý đào tạo.",
                "/uploads/assignments/db-bt1-erd.pdf", "2026-09-22T23:59:00");
        Assignment dbAssignment2 = assignment(dbClass, "Bài tập 2 - Truy vấn SQL cơ bản",
                "Viết các câu lệnh SELECT, JOIN, GROUP BY để truy vấn dữ liệu.",
                "/uploads/assignments/db-bt2-sql.pdf", "2026-09-29T23:59:00");

        assignmentRepository.saveAll(List.of(cnttAssignment, programmingAssignment, webAssignment,
                oopAssignment1, oopAssignment2, oopAssignment3, dbAssignment1, dbAssignment2));

        Submission cnttSubmission = gradedSubmission(cnttAssignment, student, "/uploads/submissions/student-bt1-cntt.pdf",
                "2026-09-10T09:30:00", 8.5, "Bài làm đầy đủ nội dung, trình bày rõ ràng.", "2026-09-11T08:00:00");
        Submission programmingSubmission = gradedSubmission(programmingAssignment, student, "/uploads/submissions/student-bt1-lap-trinh.pdf",
                "2026-09-16T14:20:00", 9.0, "Chương trình chạy đúng yêu cầu.", "2026-09-17T09:00:00");
        Submission webSubmission = submittedSubmission(webAssignment, student, "/uploads/submissions/student-bt1-web.pdf", "2026-09-18T16:45:00");
        Submission oopSubmission = gradedSubmission(oopAssignment1, student, "/uploads/submissions/student-oop-bt1.pdf",
                "2026-09-15T09:30:00", 8.5, "Bài làm đúng yêu cầu, cần trình bày code rõ hơn.", "2026-09-16T08:00:00");
        Submission oopSubmission2 = submittedSubmission(oopAssignment1, student2, "/uploads/submissions/student2-oop-bt1.pdf", "2026-09-16T10:15:00");
        Submission oopSubmission3 = submittedSubmission(oopAssignment2, student3, "/uploads/submissions/student3-oop-bt2.pdf", "2026-09-20T14:20:00");

        submissionRepository.saveAll(List.of(cnttSubmission, programmingSubmission, webSubmission,
                oopSubmission, oopSubmission2, oopSubmission3));

        gradeRepository.saveAll(List.of(
                grade(cnttSubmission, 8.5, "Bài làm đầy đủ nội dung, trình bày rõ ràng.", "2026-09-11T08:00:00"),
                grade(programmingSubmission, 9.0, "Chương trình chạy đúng yêu cầu.", "2026-09-17T09:00:00"),
                grade(oopSubmission, 8.5, "Bài làm đúng yêu cầu, cần trình bày code rõ hơn.", "2026-09-16T08:00:00")
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

    private Assignment assignment(ClassEntity classEntity, String title, String description, String fileUrl, String dueDate) {
        Assignment assignment = new Assignment();
        assignment.setClassEntity(classEntity);
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setFileUrl(fileUrl);
        assignment.setDueDate(LocalDateTime.parse(dueDate));
        assignment.setMaxScore(10.0);
        assignment.setWeight(1.0);
        assignment.setStatus(AssignmentStatus.PUBLISHED);
        assignment.setCreatedAt(LocalDateTime.now());
        return assignment;
    }

    private Submission gradedSubmission(Assignment assignment, User student, String fileUrl, String submittedAt,
            double score, String feedback, String gradedAt) {
        Submission submission = submittedSubmission(assignment, student, fileUrl, submittedAt);
        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setGradedAt(LocalDateTime.parse(gradedAt));
        submission.setStatus(SubmissionStatus.GRADED);
        return submission;
    }

    private Submission submittedSubmission(Assignment assignment, User student, String fileUrl, String submittedAt) {
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFileUrl(fileUrl);
        submission.setSubmittedAt(LocalDateTime.parse(submittedAt));
        submission.setIsLate(false);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        return submission;
    }

    private Grade grade(Submission submission, double score, String feedback, String gradedAt) {
        Grade grade = new Grade();
        grade.setSubmission(submission);
        grade.setScore(score);
        grade.setFeedback(feedback);
        grade.setGradedAt(LocalDateTime.parse(gradedAt));
        grade.setGradedBy("teacher1");
        return grade;
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
