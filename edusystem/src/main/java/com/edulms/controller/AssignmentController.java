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

import com.edulms.dto.AssignmentDetailResponse;
import com.edulms.dto.AssignmentResponse;
import com.edulms.dto.CreateAssignmentRequest;
import com.edulms.dto.UpdateAssignmentRequest;
import com.edulms.service.AssignmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {
    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(@Valid @RequestBody CreateAssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createAssignment(request));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByClass(classId));
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDetailResponse> getAssignmentDetail(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentDetail(assignmentId));
    }

    @PutMapping("/{assignmentId}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody UpdateAssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(assignmentId, request));
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
