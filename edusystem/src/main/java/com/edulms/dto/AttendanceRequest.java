package com.edulms.dto;

import java.time.LocalDate;

import com.edulms.entity.AttendanceStatus;

import lombok.Data;

@Data
public class AttendanceRequest {
    private Long classId;
    private Long studentId;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String note;
}
