package com.edulms.dto;

import lombok.Data;

@Data
public class SubmissionDetailResponse {
    private SubmissionResponse submission;
    private GradeResponse grade;
}
