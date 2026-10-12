package com.edulms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.edulms.entity.AttendanceStatus;

import lombok.Data;

@Data
public class AttendanceResponse {
    private Long id;
    private Long classId;
    private String className;
    private Long studentId;
    private String studentName;
    private String studentUsername;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String note;
    private Long markedById;
    private String markedByName;
    private LocalDateTime submittedAt;
}
