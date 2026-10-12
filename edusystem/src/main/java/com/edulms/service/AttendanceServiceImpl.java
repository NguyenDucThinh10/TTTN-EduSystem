package com.edulms.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.edulms.dto.AttendanceRequest;
import com.edulms.dto.AttendanceResponse;
import com.edulms.entity.Attendance;
import com.edulms.entity.AttendanceStatus;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.AttendanceRepository;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.UserRepository;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {
        this.attendanceRepository = attendanceRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public List<AttendanceResponse> getMyAttendance() {
        User user = currentUserService.getCurrentUser();
        return attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getClassAttendance(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        requireTeacherOrAdmin(classEntity);
        return attendanceRepository.findByClassEntityIdOrderByAttendanceDateDesc(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceResponse markByTeacher(AttendanceRequest request) {
        User marker = currentUserService.getCurrentUser();
        if (marker.getRole() != Role.TEACHER && marker.getRole() != Role.ADMIN) {
            throw new UnauthorizedClassAccessException("Chi giao vien hoac admin duoc diem danh cho lop");
        }
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        requireTeacherOrAdmin(classEntity);
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay sinh vien"));
        if (!enrollmentRepository.existsByStudentIdAndClassEntityId(student.getId(), classEntity.getId())) {
            throw new UnauthorizedClassAccessException("Sinh vien khong thuoc lop nay");
        }
        Attendance attendance = findOrCreate(classEntity, student, request.getAttendanceDate());
        attendance.setStatus(request.getStatus() != null ? request.getStatus() : AttendanceStatus.PRESENT);
        attendance.setNote(request.getNote());
        attendance.setMarkedBy(marker);
        attendance.setSubmittedAt(LocalDateTime.now());
        return mapToResponse(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponse selfSubmit(AttendanceRequest request) {
        User student = currentUserService.getCurrentUser();
        if (student.getRole() != Role.STUDENT) {
            throw new UnauthorizedClassAccessException("Chi sinh vien duoc tu nop diem danh");
        }
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        if (!enrollmentRepository.existsByStudentIdAndClassEntityId(student.getId(), classEntity.getId())) {
            throw new UnauthorizedClassAccessException("Ban khong thuoc lop hoc nay");
        }
        Attendance attendance = findOrCreate(classEntity, student, request.getAttendanceDate());
        attendance.setStatus(request.getStatus() != null ? request.getStatus() : AttendanceStatus.PENDING);
        attendance.setNote(request.getNote());
        attendance.setMarkedBy(student);
        attendance.setSubmittedAt(LocalDateTime.now());
        return mapToResponse(attendanceRepository.save(attendance));
    }

    private Attendance findOrCreate(ClassEntity classEntity, User student, LocalDate date) {
        LocalDate attendanceDate = date != null ? date : LocalDate.now();
        return attendanceRepository.findByClassEntityIdAndStudentIdAndAttendanceDate(classEntity.getId(), student.getId(), attendanceDate)
                .orElseGet(() -> {
                    Attendance attendance = new Attendance();
                    attendance.setClassEntity(classEntity);
                    attendance.setStudent(student);
                    attendance.setAttendanceDate(attendanceDate);
                    return attendance;
                });
    }

    private void requireTeacherOrAdmin(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        throw new UnauthorizedClassAccessException("Ban khong co quyen diem danh lop nay");
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setClassId(attendance.getClassEntity().getId());
        response.setClassName(attendance.getClassEntity().getName());
        response.setStudentId(attendance.getStudent().getId());
        response.setStudentName(attendance.getStudent().getFullName() != null ? attendance.getStudent().getFullName() : attendance.getStudent().getUsername());
        response.setStudentUsername(attendance.getStudent().getUsername());
        response.setAttendanceDate(attendance.getAttendanceDate());
        response.setStatus(attendance.getStatus());
        response.setNote(attendance.getNote());
        response.setSubmittedAt(attendance.getSubmittedAt());
        if (attendance.getMarkedBy() != null) {
            response.setMarkedById(attendance.getMarkedBy().getId());
            response.setMarkedByName(attendance.getMarkedBy().getFullName() != null ? attendance.getMarkedBy().getFullName() : attendance.getMarkedBy().getUsername());
        }
        return response;
    }
}
