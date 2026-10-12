package com.edulms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeSubmissionRequest {
    @NotNull
    private Double score;

    private String feedback;
}
