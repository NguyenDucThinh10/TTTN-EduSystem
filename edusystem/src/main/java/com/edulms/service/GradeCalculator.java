package com.edulms.service;

import java.util.Collection;

import org.springframework.stereotype.Component;

import com.edulms.entity.Grade;

@Component
public class GradeCalculator {
    public Double weightedScore(Grade grade) {
        return scoreOnTen(grade);
    }

    public Double scoreOnTen(Grade grade) {
        double maxScore = grade.getSubmission().getAssignment().getMaxScore();
        if (maxScore == 0) {
            return 0.0;
        }
        return grade.getScore() / maxScore * 10.0;
    }

    public Double average(Collection<Grade> grades) {
        if (grades == null || grades.isEmpty()) {
            return 0.0;
        }
        return grades.stream()
                .mapToDouble(this::scoreOnTen)
                .average()
                .orElse(0.0);
    }
}
