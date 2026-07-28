package com.edulms;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create ADMIN
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("System Admin");
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.ACTIVE);
            userRepository.save(admin);

            // Create TEACHER
            User teacher = new User();
            teacher.setUsername("teacher");
            teacher.setPasswordHash(passwordEncoder.encode("teacher123"));
            teacher.setFullName("John Doe");
            teacher.setRole(Role.TEACHER);
            teacher.setStatus(UserStatus.ACTIVE);
            userRepository.save(teacher);

            // Create STUDENT 1
            User student1 = new User();
            student1.setUsername("student1");
            student1.setPasswordHash(passwordEncoder.encode("student123"));
            student1.setFullName("Alice Smith");
            student1.setRole(Role.STUDENT);
            student1.setStatus(UserStatus.ACTIVE);
            userRepository.save(student1);

            // Create STUDENT 2
            User student2 = new User();
            student2.setUsername("student2");
            student2.setPasswordHash(passwordEncoder.encode("student123"));
            student2.setFullName("Bob Johnson");
            student2.setRole(Role.STUDENT);
            student2.setStatus(UserStatus.ACTIVE);
            userRepository.save(student2);

            System.out.println("Sample accounts created: admin, teacher, student1, student2");
        }
    }
}
