package com.edulms.service;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.edulms.dto.CreateAssignmentRequest;
import com.edulms.dto.UpdateAssignmentRequest;

@Component
public class AssignmentValidator {
    private final WeightValidator weightValidator;
    private final DateTimeUtils dateTimeUtils;

    public AssignmentValidator(WeightValidator weightValidator, DateTimeUtils dateTimeUtils) {
        this.weightValidator = weightValidator;
        this.dateTimeUtils = dateTimeUtils;
    }

    public void validateCreate(CreateAssignmentRequest request) {
        if (request.getClassId() == null) {
            throw new IllegalArgumentException("Lớp học không được để trống");
        }
        if (!StringUtils.hasText(request.getTitle())) {
            throw new IllegalArgumentException("Tiêu đề bài tập không được để trống");
        }
        validateScoreAndWeight(request.getMaxScore(), request.getWeight());
        if (request.getDueDate() != null && !dateTimeUtils.isAfterNow(request.getDueDate())) {
            throw new IllegalArgumentException("Deadline phải sau thời điểm hiện tại");
        }
    }

    public void validateUpdate(UpdateAssignmentRequest request) {
        validateScoreAndWeight(request.getMaxScore(), request.getWeight());
    }

    private void validateScoreAndWeight(Double maxScore, Double weight) {
        if (maxScore != null && maxScore <= 0) {
            throw new InvalidGradeException("Điểm tối đa phải lớn hơn 0");
        }
        if (weight != null) {
            weightValidator.validate(weight);
        }
    }
}
