package com.edulms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByClassEntityIdOrderByDueDateAsc(Long classId);
}
