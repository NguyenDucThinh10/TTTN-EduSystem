package com.edulms.dto;

import lombok.Data;

@Data
public class DashboardResponse {
    private Long classCount;
    private Long assignmentCount;
    private Long submissionCount;
    private Long gradedSubmissionCount;
    private Double averageScore;
}
