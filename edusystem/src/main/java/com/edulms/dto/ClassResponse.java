package com.edulms.dto;

import com.edulms.entity.ClassStatus;

import lombok.Data;

@Data
public class ClassResponse {
    private Long id;
    private String name;
    private String semester;
    private ClassStatus status;
    private Long subjectId;
    private String subjectCode;
    private String subjectTitle; // Tên môn học
    private Integer subjectCredits;
    private Long teacherId;
    private String teacherName; // Tên giảng viên
    private Long studentCount;
    private Boolean enrolled;
}
