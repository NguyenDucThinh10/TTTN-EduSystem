package com.edulms.dto;

import lombok.Data;

@Data
public class SubmissionStudentResponse {
    private Long studentId;
    private String studentName;
    private Boolean submitted;
    private SubmissionResponse submission;
}
