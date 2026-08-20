package com.edulms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.edulms.dto.ScheduleRequest;
import com.edulms.dto.ScheduleResponse;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Role;
import com.edulms.entity.Schedule;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.ScheduleRepository;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CurrentUserService currentUserService;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            CurrentUserService currentUserService) {
        this.scheduleRepository = scheduleRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public List<ScheduleResponse> getMySchedules() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return getAllSchedules();
        }
        if (user.getRole() == Role.TEACHER) {
            return scheduleRepository.findByClassEntityTeacherId(user.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        List<Long> classIds = enrollmentRepository.findByStudentId(user.getId()).stream()
                .map(enrollment -> enrollment.getClassEntity().getId())
                .collect(Collectors.toList());
        if (classIds.isEmpty()) {
            return List.of();
        }
        return scheduleRepository.findByClassEntityIdIn(classIds).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Schedule schedule = new Schedule();
        applyRequest(schedule, request);
        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay thoi khoa bieu"));
        applyRequest(schedule, request);
        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khong tim thay thoi khoa bieu");
        }
        scheduleRepository.deleteById(id);
    }

    private void applyRequest(Schedule schedule, ScheduleRequest request) {
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        if (request.getDayOfWeek() == null || request.getStartTime() == null || request.getEndTime() == null) {
            throw new RuntimeException("Vui long nhap day du ngay hoc, gio bat dau va gio ket thuc");
        }
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException("Gio bat dau phai truoc gio ket thuc");
        }
        schedule.setClassEntity(classEntity);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoom(request.getRoom());
        schedule.setSubject(request.getSubject());
        schedule.setNote(request.getNote());
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        ScheduleResponse response = new ScheduleResponse();
        ClassEntity classEntity = schedule.getClassEntity();
        response.setId(schedule.getId());
        response.setClassId(classEntity.getId());
        response.setClassName(classEntity.getName());
        response.setCourseCode(classEntity.getCourse().getCode());
        response.setCourseTitle(classEntity.getCourse().getTitle());
        response.setTeacherId(classEntity.getTeacher().getId());
        response.setTeacherName(classEntity.getTeacher().getFullName() != null ? classEntity.getTeacher().getFullName() : classEntity.getTeacher().getUsername());
        response.setDayOfWeek(schedule.getDayOfWeek());
        response.setStartTime(schedule.getStartTime());
        response.setEndTime(schedule.getEndTime());
        response.setRoom(schedule.getRoom());
        response.setSubject(schedule.getSubject());
        response.setNote(schedule.getNote());
        return response;
    }
}
