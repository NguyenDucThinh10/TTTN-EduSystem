package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.AttendanceRequest;
import com.edulms.dto.AttendanceResponse;
import com.edulms.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance() {
        return ResponseEntity.ok(attendanceService.getMyAttendance());
    }

    @GetMapping("/classes/{classId}")
    public ResponseEntity<List<AttendanceResponse>> getClassAttendance(@PathVariable Long classId) {
        return ResponseEntity.ok(attendanceService.getClassAttendance(classId));
    }

    @PostMapping("/teacher")
    public ResponseEntity<AttendanceResponse> markByTeacher(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markByTeacher(request));
    }

    @PostMapping("/self")
    public ResponseEntity<AttendanceResponse> selfSubmit(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.selfSubmit(request));
    }
}
