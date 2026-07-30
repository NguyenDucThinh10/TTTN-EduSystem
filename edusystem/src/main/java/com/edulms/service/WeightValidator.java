package com.edulms.service;

import org.springframework.stereotype.Component;

@Component
public class WeightValidator {
    public void validate(Double weight) {
        if (weight == null || weight <= 0) {
            throw new InvalidWeightException("Trọng số phải lớn hơn 0");
        }
    }
}
