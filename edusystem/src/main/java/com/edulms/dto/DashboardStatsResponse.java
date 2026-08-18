package com.edulms.dto;

import lombok.Data;

@Data
public class DashboardStatsResponse {
    private long totalStudents;
    private long totalTeachers;
    private long ongoingClasses;
    private long totalCourses;
}