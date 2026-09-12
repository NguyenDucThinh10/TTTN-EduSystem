package com.edulms.service;

import java.util.List;

import com.edulms.dto.TuitionPaymentRequest;
import com.edulms.dto.TuitionPaymentResponse;
import com.edulms.dto.TuitionSummaryResponse;

public interface TuitionService {
    List<TuitionSummaryResponse> getAllStudentSummaries();

    TuitionSummaryResponse getMySummary();

    TuitionSummaryResponse getStudentSummary(Long studentId);

    TuitionPaymentResponse createPaymentRequest(TuitionPaymentRequest request);

    TuitionPaymentResponse adminRecordPayment(TuitionPaymentRequest request);

    TuitionPaymentResponse confirmPayment(Long paymentId);

    TuitionPaymentResponse rejectPayment(Long paymentId);

    void deletePayment(Long paymentId);
}
