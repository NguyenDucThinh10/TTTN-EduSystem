package com.edulms.service;

import java.util.List;

import com.edulms.dto.ScheduleRequest;
import com.edulms.dto.ScheduleResponse;

public interface ScheduleService {
    List<ScheduleResponse> getMySchedules();

    List<ScheduleResponse> getAllSchedules();

    ScheduleResponse createSchedule(ScheduleRequest request);

    ScheduleResponse updateSchedule(Long id, ScheduleRequest request);

    void deleteSchedule(Long id);
}
