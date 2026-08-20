package com.edulms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateGradeRequest {
    @NotNull
    private Double score;

    private String feedback;
}
