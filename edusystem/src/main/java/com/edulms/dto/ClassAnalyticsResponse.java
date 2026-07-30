package com.edulms.dto;

import java.util.List;

import lombok.Data;

@Data
public class ClassAnalyticsResponse {
    private Long classId;
    private String className;
    private Long studentCount;
    private Long assignmentCount;
    private Double classAverage;
    private List<StudentProgressResponse> studentProgress;
    private List<AssignmentStatisticsResponse> assignmentStatistics;
    private List<ScoreDistributionResponse> scoreDistribution;
}
