package com.edulms.dto;

import java.util.List;

import lombok.Data;

@Data
public class StudentAnalyticsResponse {
    private Long studentId;
    private String studentName;
    private Double averageScore;
    private Double completionRate;
    private List<GradeResponse> grades;
}
