package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.CourseRequest;
import com.edulms.dto.CourseResponse;
import com.edulms.service.CourseService;

@RestController
@RequestMapping("/api/admin/courses")
@CrossOrigin(origins = "*") // Bổ sung cấu hình CORS để Frontend (React) không bị chặn
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // API Tạo môn học mới (Code cũ của bạn giữ nguyên)
    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest request) {
        CourseResponse response = courseService.createCourse(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
