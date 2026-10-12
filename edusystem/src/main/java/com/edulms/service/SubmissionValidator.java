package com.edulms.service;

import org.springframework.stereotype.Component;

import com.edulms.entity.Assignment;

@Component
public class SubmissionValidator {
    private final DateTimeUtils dateTimeUtils;

    public SubmissionValidator(DateTimeUtils dateTimeUtils) {
        this.dateTimeUtils = dateTimeUtils;
    }

    public boolean isLate(Assignment assignment) {
        return assignment.getDueDate() != null && dateTimeUtils.now().isAfter(assignment.getDueDate());
    }

    public void validateDeadline(Assignment assignment) {
        if (isLate(assignment)) {
            throw new DeadlineExceededException("Đã quá hạn nộp bài");
        }
    }
}
