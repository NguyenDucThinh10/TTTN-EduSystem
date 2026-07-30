package com.edulms.service;

import com.edulms.dto.ClassAnalyticsResponse;
import com.edulms.dto.DashboardResponse;
import com.edulms.dto.StudentAnalyticsResponse;

public interface AnalyticsService {
    DashboardResponse getDashboard();
    ClassAnalyticsResponse getClassAnalytics(Long classId);
    StudentAnalyticsResponse getStudentAnalytics(Long studentId, Long classId);
}
