package com.edulms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByClassEntityId(Long classId);
    List<Enrollment> findByStudentId(Long studentId);
    Optional<Enrollment> findByClassEntityIdAndStudentId(Long classId, Long studentId);
    long countByClassEntityId(Long classId);
}
