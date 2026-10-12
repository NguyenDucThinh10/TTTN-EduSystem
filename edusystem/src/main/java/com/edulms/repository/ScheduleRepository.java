package com.edulms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByClassEntityId(Long classId);

    List<Schedule> findByClassEntityTeacherId(Long teacherId);

    List<Schedule> findByClassEntityIdIn(List<Long> classIds);
}
