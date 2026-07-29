package com.edulms.dto;

import lombok.Data;

@Data
public class CourseRequest {
    private String code;
    private String title;
    private Integer credits;
}