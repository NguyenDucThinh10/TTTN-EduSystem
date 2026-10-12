package com.edulms.dto;

import java.util.List;

import lombok.Data;

@Data
public class AssignmentDetailResponse {
    private AssignmentResponse assignment;
    private List<SubmissionStudentResponse> submissions;
}
