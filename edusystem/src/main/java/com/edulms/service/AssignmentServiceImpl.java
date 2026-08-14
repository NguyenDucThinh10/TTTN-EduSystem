package com.edulms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edulms.dto.AssignmentDetailResponse;
import com.edulms.dto.AssignmentResponse;
import com.edulms.dto.CreateAssignmentRequest;
import com.edulms.dto.SubmissionStudentResponse;
import com.edulms.dto.UpdateAssignmentRequest;
import com.edulms.entity.Assignment;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.AssignmentRepository;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.SubmissionRepository;

@Service
public class AssignmentServiceImpl implements AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CurrentUserService currentUserService;
    private final AssignmentValidator assignmentValidator;
    private final SubmissionService submissionService;

    public AssignmentServiceImpl(
            AssignmentRepository assignmentRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            SubmissionRepository submissionRepository,
            CurrentUserService currentUserService,
            AssignmentValidator assignmentValidator,
            SubmissionService submissionService) {
        this.assignmentRepository = assignmentRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.submissionRepository = submissionRepository;
        this.currentUserService = currentUserService;
        this.assignmentValidator = assignmentValidator;
        this.submissionService = submissionService;
    }

    @Override
    public AssignmentResponse createAssignment(CreateAssignmentRequest request) {
        assignmentValidator.validateCreate(request);
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        requireTeacherOfClass(classEntity);
        requireOpenClass(classEntity);

        Assignment assignment = new Assignment();
        assignment.setClassEntity(classEntity);
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setFileUrl(request.getFileUrl());
        assignment.setDueDate(request.getDueDate());
        assignment.setMaxScore(request.getMaxScore());
        assignment.setWeight(request.getWeight());
        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentResponse updateAssignment(Long assignmentId, UpdateAssignmentRequest request) {
        assignmentValidator.validateUpdate(request);
        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireTeacherOfClass(assignment.getClassEntity());
        requireOpenClass(assignment.getClassEntity());

        if (request.getTitle() != null) {
            assignment.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            assignment.setDescription(request.getDescription());
        }
        if (request.getFileUrl() != null) {
            assignment.setFileUrl(request.getFileUrl());
        }
        if (request.getDueDate() != null) {
            assignment.setDueDate(request.getDueDate());
        }
        if (request.getMaxScore() != null) {
            assignment.setMaxScore(request.getMaxScore());
        }
        if (request.getWeight() != null) {
            assignment.setWeight(request.getWeight());
        }
        if (request.getStatus() != null) {
            assignment.setStatus(request.getStatus());
        }
        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Override
    public List<AssignmentResponse> getAssignmentsByClass(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        requireClassAccess(classEntity);
        return assignmentRepository.findByClassEntityIdOrderByDueDateAsc(classId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AssignmentDetailResponse getAssignmentDetail(Long assignmentId) {
        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireClassAccess(assignment.getClassEntity());
        AssignmentDetailResponse response = new AssignmentDetailResponse();
        response.setAssignment(mapToResponse(assignment));
        response.setSubmissions(submissionService.getSubmissionStudents(assignmentId));
        return response;
    }

    @Override
    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireTeacherOfClass(assignment.getClassEntity());
        requireOpenClass(assignment.getClassEntity());
        assignmentRepository.delete(assignment);
    }

    private Assignment getAssignmentOrThrow(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập"));
    }

    private void requireTeacherOfClass(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (user.getRole() != Role.TEACHER || !classEntity.getTeacher().getId().equals(user.getId())) {
            throw new UnauthorizedClassAccessException("Bạn không có quyền quản lý lớp này");
        }
    }

    private void requireClassAccess(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        enrollmentRepository.findByClassEntityIdAndStudentId(classEntity.getId(), user.getId())
                .orElseThrow(() -> new UnauthorizedClassAccessException("Bạn không thuộc lớp học này"));
    }

    private void requireOpenClass(ClassEntity classEntity) {
        if (classEntity.getStatus() == ClassStatus.COMPLETED) {
            throw new InvalidGradeException("Lop hoc da ket thuc, khong the thay doi bai tap");
        }
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setClassId(assignment.getClassEntity().getId());
        response.setClassName(assignment.getClassEntity().getName());
        response.setTitle(assignment.getTitle());
        response.setDescription(assignment.getDescription());
        response.setFileUrl(assignment.getFileUrl());
        response.setDueDate(assignment.getDueDate());
        response.setMaxScore(assignment.getMaxScore());
        response.setWeight(assignment.getWeight());
        response.setStatus(assignment.getStatus());
        response.setCreatedAt(assignment.getCreatedAt());
        response.setSubmissionCount(submissionRepository.countByAssignmentId(assignment.getId()));
        return response;
    }
}
