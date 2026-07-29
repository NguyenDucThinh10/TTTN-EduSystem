package com.edulms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.ClassEntity;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
}