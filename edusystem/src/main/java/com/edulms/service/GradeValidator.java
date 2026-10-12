package com.edulms.service;

import org.springframework.stereotype.Component;

@Component
public class GradeValidator {
    public void validate(Double score, Double maxScore) {
        if (score == null) {
            throw new InvalidGradeException("Điểm không được để trống");
        }
        if (maxScore == null || maxScore <= 0) {
            throw new InvalidGradeException("Điểm tối đa không hợp lệ");
        }
        if (score < 0 || score > maxScore) {
            throw new InvalidGradeException("Điểm phải nằm trong khoảng 0 đến " + maxScore);
        }
    }
}
