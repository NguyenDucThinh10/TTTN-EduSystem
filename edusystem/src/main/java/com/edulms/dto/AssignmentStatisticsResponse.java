package com.edulms.dto;

import lombok.Data;

@Data
public class AssignmentStatisticsResponse {
    private Long assignmentId;
    private String assignmentTitle;
    private Long submissionCount;
    private Long gradedCount;
    private Double averageScore;
    private Double minScore;
    private Double maxScore;
}
