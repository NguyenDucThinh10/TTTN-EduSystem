package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;
import com.edulms.service.ClassService;

@RestController
@RequestMapping("/api/admin/classes")
@CrossOrigin(origins = "*") // Mở sẵn CORS để lát nữa ReactJS gọi không bị lỗi
public class AdminClassController {

    private final ClassService classService; // Sử dụng Interface chuẩn mực

    public AdminClassController(ClassService classService) {
        this.classService = classService;
    }

    // API Tạo lớp học mới
    @PostMapping
    public ResponseEntity<ClassResponse> createClass(@RequestBody ClassRequest request) {
        ClassResponse response = classService.createClass(request);
        return ResponseEntity.ok(response);
    }

    // API Lấy danh sách toàn bộ lớp học
    @GetMapping
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }
}