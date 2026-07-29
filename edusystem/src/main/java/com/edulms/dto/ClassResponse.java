package com.edulms.dto;

import com.edulms.entity.ClassStatus;

import lombok.Data;

@Data
public class ClassResponse {
    private Long id;
    private String name;
    private String semester;
    private ClassStatus status;
    private String courseTitle; // Tên môn học
    private String teacherName; // Tên giảng viên
}