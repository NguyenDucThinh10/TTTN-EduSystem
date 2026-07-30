package com.edulms.service;

import java.util.Collection;

import org.springframework.stereotype.Component;

import com.edulms.entity.Grade;

@Component
public class GradeCalculator {
    public Double weightedScore(Grade grade) {
        double maxScore = grade.getSubmission().getAssignment().getMaxScore();
        double weight = grade.getSubmission().getAssignment().getWeight();
        return grade.getScore() / maxScore * weight;
    }

    public Double average(Collection<Grade> grades) {
        if (grades == null || grades.isEmpty()) {
            return 0.0;
        }
        double totalWeight = grades.stream()
                .mapToDouble(grade -> grade.getSubmission().getAssignment().getWeight())
                .sum();
        if (totalWeight == 0) {
            return 0.0;
        }
        double weighted = grades.stream().mapToDouble(this::weightedScore).sum();
        return weighted / totalWeight * 10.0;
    }
}
