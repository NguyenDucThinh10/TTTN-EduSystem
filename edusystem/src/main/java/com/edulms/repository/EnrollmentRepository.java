package com.edulms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edulms.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByClassEntityId(Long classId);

    List<Enrollment> findByStudentId(Long studentId);

    Optional<Enrollment> findByClassEntityIdAndStudentId(Long classId, Long studentId);

    boolean existsByStudentIdAndClassEntityId(Long studentId, Long classId);

    long countByClassEntityId(Long classId);
}
