package com.edulms.dto;

import java.util.List;

import lombok.Data;

@Data
public class StudentGradeResponse {
    private Long studentId;
    private String studentName;
    private Long classId;
    private String className;
    private Double averageScore;
    private List<GradeResponse> grades;
}
