package com.edulms;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;
import com.edulms.entity.Course;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Chỉ chạy insert data nếu bảng User đang trống (chưa có ai)
        if (userRepository.count() == 0) {
            
            // ==========================================
            // 1. TẠO TÀI KHOẢN MẪU (USERS)
            // ==========================================
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("123456"));
            admin.setFullName("Nguyễn Đức Thịnh"); 
            admin.setEmail("thinh.admin@edulms.com");
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.ACTIVE);

            User teacher = new User();
            teacher.setUsername("teacher1");
            teacher.setPasswordHash(passwordEncoder.encode("123456"));
            teacher.setFullName("Giảng viên IT");
            teacher.setEmail("teacher@edulms.com");
            teacher.setRole(Role.TEACHER);
            teacher.setStatus(UserStatus.ACTIVE);

            User student = new User();
            student.setUsername("student");
            student.setPasswordHash(passwordEncoder.encode("123456"));
            student.setFullName("Student Demo");
            student.setEmail("student@edulms.com");
            student.setRole(Role.STUDENT);
            student.setStatus(UserStatus.ACTIVE);

            userRepository.saveAll(List.of(admin, teacher, student));

            // ==========================================
            // 2. TẠO MÔN HỌC MẪU (COURSES)
            // ==========================================
            Course course1 = new Course(null, "IT001", "Xây dựng phần mềm Hướng đối tượng (XDPM-OOP)", 3);
            Course course2 = new Course(null, "IT002", "Relational Database Theory", 3);
            Course course3 = new Course(null, "IT003", "Data Engineering Fundamentals", 4);
            
            courseRepository.saveAll(List.of(course1, course2, course3));

            // ==========================================
            // 3. TẠO LỚP HỌC MẪU (CLASSES)
            // ==========================================
            ClassEntity class1 = new ClassEntity(null, course1, teacher, "XDPM-OOP-K1", "Học kỳ 1 - 2026", ClassStatus.ONGOING);
            ClassEntity class2 = new ClassEntity(null, course2, teacher, "DB-Theory-K1", "Học kỳ 1 - 2026", ClassStatus.ONGOING);

            classRepository.saveAll(List.of(class1, class2));

            System.out.println("====== MOCK DATA INITIALIZED SUCCESSFULLY ======");
        }
    }
}
