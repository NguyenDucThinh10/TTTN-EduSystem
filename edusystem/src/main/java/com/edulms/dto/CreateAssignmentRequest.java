package com.edulms.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateAssignmentRequest {
    @NotNull
    private Long classId;

    @NotBlank
    private String title;

    private String description;
    private String fileUrl;
    private LocalDateTime dueDate;

    @Positive
    private Double maxScore = 10.0;

    @Positive
    private Double weight = 1.0;
}
