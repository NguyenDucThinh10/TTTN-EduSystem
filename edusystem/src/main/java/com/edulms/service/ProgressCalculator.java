package com.edulms.service;

import org.springframework.stereotype.Component;

@Component
public class ProgressCalculator {
    public Double percent(long completed, long total) {
        if (total <= 0) {
            return 0.0;
        }
        return completed * 100.0 / total;
    }
}
