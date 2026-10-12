package com.edulms.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.edulms.dto.ScoreDistributionResponse;
import com.edulms.entity.Grade;

@Component
public class ScoreDistributionCalculator {
    public List<ScoreDistributionResponse> calculate(List<Grade> grades) {
        Map<String, Long> counts = grades.stream()
                .collect(Collectors.groupingBy(grade -> range(grade.getScore()), Collectors.counting()));
        return List.of(response("0-4", counts), response("4-6.5", counts), response("6.5-8", counts), response("8-10", counts));
    }

    private ScoreDistributionResponse response(String range, Map<String, Long> counts) {
        ScoreDistributionResponse response = new ScoreDistributionResponse();
        response.setRange(range);
        response.setCount(counts.getOrDefault(range, 0L));
        return response;
    }

    private String range(Double score) {
        if (score == null || score < 4) {
            return "0-4";
        }
        if (score < 6.5) {
            return "4-6.5";
        }
        if (score < 8) {
            return "6.5-8";
        }
        return "8-10";
    }
}
