package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.ClassResponse;
import com.edulms.dto.UserResponse;
import com.edulms.service.ClassService;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<ClassResponse>> getMyClasses() {
        return ResponseEntity.ok(classService.getMyClasses());
    }

    @GetMapping("/open")
    public ResponseEntity<List<ClassResponse>> getOpenClassesForRegistration() {
        return ResponseEntity.ok(classService.getOpenClassesForRegistration());
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ClassResponse> selfEnroll(@PathVariable Long id) {
        return ResponseEntity.ok(classService.selfEnroll(id));
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<Void> cancelSelfEnrollment(@PathVariable Long id) {
        classService.cancelSelfEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassResponse> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<UserResponse>> getClassStudents(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassStudents(id));
    }
}
