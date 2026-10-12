package com.edulms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.TuitionPaymentRequest;
import com.edulms.dto.TuitionPaymentResponse;
import com.edulms.dto.TuitionSummaryResponse;
import com.edulms.service.TuitionService;

@RestController
@RequestMapping("/api/admin/tuitions")
public class AdminTuitionController {

    private final TuitionService tuitionService;

    public AdminTuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @GetMapping
    public ResponseEntity<List<TuitionSummaryResponse>> getAllStudentSummaries() {
        return ResponseEntity.ok(tuitionService.getAllStudentSummaries());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<TuitionSummaryResponse> getStudentSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(tuitionService.getStudentSummary(studentId));
    }

    @PostMapping("/payments")
    public ResponseEntity<TuitionPaymentResponse> recordPayment(@RequestBody TuitionPaymentRequest request) {
        return ResponseEntity.ok(tuitionService.adminRecordPayment(request));
    }

    @PostMapping("/payments/{paymentId}/confirm")
    public ResponseEntity<TuitionPaymentResponse> confirmPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(tuitionService.confirmPayment(paymentId));
    }

    @PostMapping("/payments/{paymentId}/reject")
    public ResponseEntity<TuitionPaymentResponse> rejectPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(tuitionService.rejectPayment(paymentId));
    }

    @DeleteMapping("/payments/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long paymentId) {
        tuitionService.deletePayment(paymentId);
        return ResponseEntity.noContent().build();
    }
}
