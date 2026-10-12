package com.edulms.service;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Component;

@Component
public class DateTimeUtils {
    private static final ZoneId APP_ZONE = ZoneId.of("Asia/Bangkok");

    public LocalDateTime now() {
        return LocalDateTime.now(APP_ZONE);
    }

    public boolean isAfterNow(LocalDateTime value) {
        return value != null && value.isAfter(now());
    }
}
