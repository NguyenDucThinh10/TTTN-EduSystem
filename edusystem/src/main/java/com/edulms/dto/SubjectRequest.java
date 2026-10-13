package com.edulms.dto;

import lombok.Data;

@Data
public class SubjectRequest {
    private String code;
    private String title;
    private Integer credits;
}