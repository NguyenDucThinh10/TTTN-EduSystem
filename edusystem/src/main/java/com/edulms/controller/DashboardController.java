package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.DashboardStatsResponse;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;

    public DashboardController(UserRepository userRepository, ClassRepository classRepository, CourseRepository courseRepository) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        
        
        // Lấy tất cả User và dùng Stream để đếm số Sinh viên / Giảng viên (Trạng thái ACTIVE)
        List<User> allUsers = userRepository.findAll();
        
        long studentCount = allUsers.stream()
                .filter(u -> u.getRole() == Role.STUDENT && "ACTIVE".equals(u.getStatus()))
                .count();
                
        long teacherCount = allUsers.stream()
                .filter(u -> u.getRole() == Role.TEACHER && "ACTIVE".equals(u.getStatus()))
                .count();
                
        stats.setTotalStudents(studentCount);
        stats.setTotalTeachers(teacherCount);
        
        // Lấy tất cả Lớp học và dùng Stream đếm các lớp Đang diễn ra (ONGOING)
        List<ClassEntity> allClasses = classRepository.findAll();
        
        long ongoingClasses = allClasses.stream()
                .filter(c -> "ONGOING".equals(c.getStatus()))
                .count();
                
        stats.setOngoingClasses(ongoingClasses);
        
        // Đếm tổng số môn học (Hàm count() này là của hệ thống, luôn tồn tại)
        stats.setTotalCourses(courseRepository.count());

        return ResponseEntity.ok(stats);
    }
}