package com.edulms.dto;

import lombok.Data;

@Data
public class TuitionPaymentRequest {
    private Long studentId;
    private Long amount;
    private String note;
}
