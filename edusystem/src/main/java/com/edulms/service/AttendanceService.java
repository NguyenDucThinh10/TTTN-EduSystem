package com.edulms.service;

import java.util.List;

import com.edulms.dto.AttendanceRequest;
import com.edulms.dto.AttendanceResponse;

public interface AttendanceService {
    List<AttendanceResponse> getMyAttendance();

    List<AttendanceResponse> getClassAttendance(Long classId);

    AttendanceResponse markByTeacher(AttendanceRequest request);

    AttendanceResponse selfSubmit(AttendanceRequest request);
}
