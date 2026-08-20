package com.edulms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
    List<ClassEntity> findByTeacherId(Long teacherId);

    List<ClassEntity> findByStatus(ClassStatus status);

    long countByStatus(ClassStatus status);
}
