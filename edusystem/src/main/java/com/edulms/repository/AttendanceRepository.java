package com.edulms.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edulms.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassEntityIdOrderByAttendanceDateDesc(Long classId);

    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);

    Optional<Attendance> findByClassEntityIdAndStudentIdAndAttendanceDate(Long classId, Long studentId, LocalDate attendanceDate);
}
