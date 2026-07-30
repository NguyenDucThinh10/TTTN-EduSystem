package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.SubmissionDetailResponse;
import com.edulms.dto.SubmissionResponse;
import com.edulms.dto.SubmissionStudentResponse;
import com.edulms.service.SubmissionService;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/assignments/{assignmentId}")
    public ResponseEntity<SubmissionResponse> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(submissionService.submitAssignment(assignmentId, file));
    }

    @GetMapping("/me")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions() {
        return ResponseEntity.ok(submissionService.getMySubmissions());
    }

    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/students")
    public ResponseEntity<List<SubmissionStudentResponse>> getSubmissionStudents(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionStudents(assignmentId));
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionDetailResponse> getSubmissionDetail(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionService.getSubmissionDetail(submissionId));
    }
}
