package com.edulms.service;

import java.util.List;

import com.edulms.dto.AssignmentDetailResponse;
import com.edulms.dto.AssignmentResponse;
import com.edulms.dto.CreateAssignmentRequest;
import com.edulms.dto.UpdateAssignmentRequest;

public interface AssignmentService {
    AssignmentResponse createAssignment(CreateAssignmentRequest request);
    AssignmentResponse updateAssignment(Long assignmentId, UpdateAssignmentRequest request);
    List<AssignmentResponse> getAssignmentsByClass(Long classId);
    AssignmentDetailResponse getAssignmentDetail(Long assignmentId);
    void deleteAssignment(Long assignmentId);
}
