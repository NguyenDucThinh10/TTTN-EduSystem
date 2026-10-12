package com.edulms.dto;

import java.time.LocalDateTime;

import com.edulms.entity.AssignmentStatus;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateAssignmentRequest {
    private String title;
    private String description;
    private String fileUrl;
    private LocalDateTime dueDate;

    @Positive
    private Double maxScore;

    @Positive
    private Double weight;

    private AssignmentStatus status;
}
