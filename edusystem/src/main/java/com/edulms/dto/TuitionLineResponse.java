package com.edulms.dto;

import lombok.Data;

@Data
public class TuitionLineResponse {
    private Long classId;
    private String className;
    private String semester;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Integer credits;
    private Long amount;
}
