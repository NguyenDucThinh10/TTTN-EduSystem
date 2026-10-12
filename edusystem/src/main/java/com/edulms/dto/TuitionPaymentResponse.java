package com.edulms.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TuitionPaymentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long amount;
    private String status;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private String confirmedByName;
}
