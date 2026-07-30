package com.edulms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.GradeResponse;
import com.edulms.dto.GradeSubmissionRequest;
import com.edulms.dto.StudentGradeResponse;
import com.edulms.dto.UpdateGradeRequest;
import com.edulms.service.GradeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {
    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PutMapping("/submissions/{submissionId}")
    public ResponseEntity<GradeResponse> gradeSubmission(
            @PathVariable Long submissionId,
            @Valid @RequestBody GradeSubmissionRequest request) {
        return ResponseEntity.ok(gradeService.gradeSubmission(submissionId, request));
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<GradeResponse> updateGrade(
            @PathVariable Long gradeId,
            @Valid @RequestBody UpdateGradeRequest request) {
        return ResponseEntity.ok(gradeService.updateGrade(gradeId, request));
    }

    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<GradeResponse> getGradeBySubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(gradeService.getGradeBySubmission(submissionId));
    }

    @GetMapping("/students/{studentId}/classes/{classId}")
    public ResponseEntity<StudentGradeResponse> getStudentGrades(
            @PathVariable Long studentId,
            @PathVariable Long classId) {
        return ResponseEntity.ok(gradeService.getStudentGrades(studentId, classId));
    }
}
