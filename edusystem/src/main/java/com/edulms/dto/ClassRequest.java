package com.edulms.dto;

import com.edulms.entity.ClassStatus;

import lombok.Data;

@Data
public class ClassRequest {
    private Long subjectId;
    private Long teacherId;
    private String name;
    private String semester;
    private ClassStatus status;
}