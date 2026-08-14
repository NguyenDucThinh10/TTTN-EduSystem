package com.edulms.dto;

import lombok.Data;

@Data
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalAdmins;
    private long totalTeachers;
    private long totalStudents;
    private long totalCourses;
    private long totalClasses;
    private long totalAssignments;
    private long totalSubmissions;
    private long totalGradedSubmissions;
}
