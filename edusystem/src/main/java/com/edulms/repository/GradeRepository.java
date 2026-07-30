package com.edulms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.Grade;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findBySubmissionId(Long submissionId);
    List<Grade> findBySubmissionAssignmentClassEntityId(Long classId);
    List<Grade> findBySubmissionStudentIdAndSubmissionAssignmentClassEntityId(Long studentId, Long classId);
}
