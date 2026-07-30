package com.edulms.dto;

import java.time.LocalDateTime;

import com.edulms.entity.SubmissionStatus;

import lombok.Data;

@Data
public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private String fileUrl;
    private LocalDateTime submittedAt;
    private Boolean isLate;
    private SubmissionStatus status;
    private Double score;
    private String feedback;
    private LocalDateTime gradedAt;
}
