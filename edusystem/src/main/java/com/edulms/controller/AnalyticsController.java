package com.edulms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.ClassAnalyticsResponse;
import com.edulms.dto.DashboardResponse;
import com.edulms.dto.StudentAnalyticsResponse;
import com.edulms.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }

    @GetMapping("/classes/{classId}")
    public ResponseEntity<ClassAnalyticsResponse> getClassAnalytics(@PathVariable Long classId) {
        return ResponseEntity.ok(analyticsService.getClassAnalytics(classId));
    }

    @GetMapping("/students/{studentId}/classes/{classId}")
    public ResponseEntity<StudentAnalyticsResponse> getStudentAnalytics(
            @PathVariable Long studentId,
            @PathVariable Long classId) {
        return ResponseEntity.ok(analyticsService.getStudentAnalytics(studentId, classId));
    }
}
