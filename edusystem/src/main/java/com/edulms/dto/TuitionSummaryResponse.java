package com.edulms.dto;

import java.util.List;

import lombok.Data;

@Data
public class TuitionSummaryResponse {
    private Long studentId;
    private String studentName;
    private Long totalCredits;
    private Long totalAmount;
    private Long paidAmount;
    private Long pendingAmount;
    private Long debtAmount;
    private String status;
    private List<TuitionLineResponse> lines;
    private List<TuitionPaymentResponse> payments;
}
