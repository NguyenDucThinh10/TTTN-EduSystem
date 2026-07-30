package com.edulms.dto;

import java.time.LocalDateTime;

import com.edulms.entity.AssignmentStatus;

import lombok.Data;

@Data
public class AssignmentResponse {
    private Long id;
    private Long classId;
    private String className;
    private String title;
    private String description;
    private String fileUrl;
    private LocalDateTime dueDate;
    private Double maxScore;
    private Double weight;
    private AssignmentStatus status;
    private LocalDateTime createdAt;
    private Long submissionCount;
}
