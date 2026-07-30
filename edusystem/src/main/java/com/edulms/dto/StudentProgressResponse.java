package com.edulms.dto;

import lombok.Data;

@Data
public class StudentProgressResponse {
    private Long studentId;
    private String studentName;
    private Long classId;
    private Integer totalAssignments;
    private Integer submittedAssignments;
    private Integer gradedAssignments;
    private Double completionRate;
    private Double averageScore;
}
