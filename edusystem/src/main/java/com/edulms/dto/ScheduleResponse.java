package com.edulms.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

import lombok.Data;

@Data
public class ScheduleResponse {
    private Long id;
    private Long classId;
    private String className;
    private String courseCode;
    private String courseTitle;
    private Long teacherId;
    private String teacherName;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private String subject;
    private String note;
}
