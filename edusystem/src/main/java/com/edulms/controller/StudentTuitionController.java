package com.edulms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.TuitionPaymentRequest;
import com.edulms.dto.TuitionPaymentResponse;
import com.edulms.dto.TuitionSummaryResponse;
import com.edulms.service.TuitionService;

@RestController
@RequestMapping("/api/student/tuitions")
public class StudentTuitionController {

    private final TuitionService tuitionService;

    public StudentTuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @GetMapping("/my")
    public ResponseEntity<TuitionSummaryResponse> getMySummary() {
        return ResponseEntity.ok(tuitionService.getMySummary());
    }

    @PostMapping("/payments")
    public ResponseEntity<TuitionPaymentResponse> createPaymentRequest(@RequestBody TuitionPaymentRequest request) {
        return ResponseEntity.ok(tuitionService.createPaymentRequest(request));
    }
}
