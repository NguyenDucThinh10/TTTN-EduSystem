package com.edulms.dto;

import lombok.Data;

@Data
public class CourseResponse {
    private Long id;
    private String code;
    private String title;
    private Integer credits;
    private Long tuitionFee;
}
