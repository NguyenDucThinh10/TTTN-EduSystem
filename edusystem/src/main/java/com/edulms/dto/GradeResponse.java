package com.edulms.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class GradeResponse {
    private Long id;
    private Long submissionId;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private Double score;
    private Double maxScore;
    private Double weightedScore;
    private String feedback;
    private LocalDateTime gradedAt;
    private String gradedBy;
}
