package com.edulms.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.GradeResponse;
import com.edulms.dto.SubmissionDetailResponse;
import com.edulms.dto.SubmissionResponse;
import com.edulms.dto.SubmissionStudentResponse;
import com.edulms.entity.Assignment;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Enrollment;
import com.edulms.entity.Grade;
import com.edulms.entity.Role;
import com.edulms.entity.Submission;
import com.edulms.entity.SubmissionStatus;
import com.edulms.entity.User;
import com.edulms.repository.AssignmentRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.GradeRepository;
import com.edulms.repository.SubmissionRepository;

@Service
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final CurrentUserService currentUserService;
    private final SubmissionValidator submissionValidator;
    private final FileValidator fileValidator;
    private final FileStorageService fileStorageService;
    private final DateTimeUtils dateTimeUtils;

    public SubmissionServiceImpl(
            SubmissionRepository submissionRepository,
            AssignmentRepository assignmentRepository,
            EnrollmentRepository enrollmentRepository,
            GradeRepository gradeRepository,
            CurrentUserService currentUserService,
            SubmissionValidator submissionValidator,
            FileValidator fileValidator,
            FileStorageService fileStorageService,
            DateTimeUtils dateTimeUtils) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRepository = gradeRepository;
        this.currentUserService = currentUserService;
        this.submissionValidator = submissionValidator;
        this.fileValidator = fileValidator;
        this.fileStorageService = fileStorageService;
        this.dateTimeUtils = dateTimeUtils;
    }

    @Override
    public SubmissionResponse submitAssignment(Long assignmentId, MultipartFile file) {
        User student = currentUserService.getCurrentUser();
        if (student.getRole() != Role.STUDENT) {
            throw new UnauthorizedClassAccessException("Chỉ sinh viên được nộp bài");
        }

        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireStudentInClass(assignment.getClassEntity(), student);
        submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .ifPresent(existing -> {
                    throw new DuplicateSubmissionException("Sinh viên đã nộp bài tập này");
                });
        submissionValidator.validateDeadline(assignment);
        fileValidator.validate(file);

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFileUrl(fileStorageService.storeSubmissionFile(file));
        submission.setSubmittedAt(dateTimeUtils.now());
        submission.setIsLate(submissionValidator.isLate(assignment));
        submission.setStatus(submission.getIsLate() ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED);
        return mapToResponse(submissionRepository.save(submission));
    }

    @Override
    public List<SubmissionResponse> getMySubmissions() {
        User user = currentUserService.getCurrentUser();
        return submissionRepository.findByStudentId(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<SubmissionResponse> getSubmissionsByAssignment(Long assignmentId) {
        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireTeacherOfClass(assignment.getClassEntity());
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<SubmissionStudentResponse> getSubmissionStudents(Long assignmentId) {
        Assignment assignment = getAssignmentOrThrow(assignmentId);
        requireTeacherOfClass(assignment.getClassEntity());
        return enrollmentRepository.findByClassEntityId(assignment.getClassEntity().getId()).stream()
                .map(enrollment -> mapStudentSubmission(assignment, enrollment))
                .toList();
    }

    @Override
    public SubmissionDetailResponse getSubmissionDetail(Long submissionId) {
        Submission submission = getSubmissionOrThrow(submissionId);
        requireSubmissionAccess(submission);
        SubmissionDetailResponse response = new SubmissionDetailResponse();
        response.setSubmission(mapToResponse(submission));
        gradeRepository.findBySubmissionId(submissionId).ifPresent(grade -> response.setGrade(mapGradeToResponse(grade)));
        return response;
    }

    private SubmissionStudentResponse mapStudentSubmission(Assignment assignment, Enrollment enrollment) {
        SubmissionStudentResponse response = new SubmissionStudentResponse();
        response.setStudentId(enrollment.getStudent().getId());
        response.setStudentName(displayName(enrollment.getStudent()));
        submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), enrollment.getStudent().getId())
                .ifPresentOrElse(
                        submission -> {
                            response.setSubmitted(true);
                            response.setSubmission(mapToResponse(submission));
                        },
                        () -> response.setSubmitted(false));
        return response;
    }

    private void requireSubmissionAccess(Submission submission) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || submission.getStudent().getId().equals(user.getId())) {
            return;
        }
        if (user.getRole() == Role.TEACHER && submission.getAssignment().getClassEntity().getTeacher().getId().equals(user.getId())) {
            return;
        }
        throw new UnauthorizedClassAccessException("Bạn không có quyền xem bài nộp này");
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

    private void requireStudentInClass(ClassEntity classEntity, User student) {
        enrollmentRepository.findByClassEntityIdAndStudentId(classEntity.getId(), student.getId())
                .orElseThrow(() -> new UnauthorizedClassAccessException("Sinh viên không thuộc lớp học này"));
    }

    private Assignment getAssignmentOrThrow(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập"));
    }

    private Submission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài nộp"));
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(submission.getId());
        response.setAssignmentId(submission.getAssignment().getId());
        response.setAssignmentTitle(submission.getAssignment().getTitle());
        response.setStudentId(submission.getStudent().getId());
        response.setStudentName(displayName(submission.getStudent()));
        response.setFileUrl(submission.getFileUrl());
        response.setSubmittedAt(submission.getSubmittedAt());
        response.setIsLate(submission.getIsLate());
        response.setStatus(submission.getStatus());
        response.setScore(submission.getScore());
        response.setFeedback(submission.getFeedback());
        response.setGradedAt(submission.getGradedAt());
        return response;
    }

    private GradeResponse mapGradeToResponse(Grade grade) {
        Submission submission = grade.getSubmission();
        Assignment assignment = submission.getAssignment();
        GradeResponse response = new GradeResponse();
        response.setId(grade.getId());
        response.setSubmissionId(submission.getId());
        response.setAssignmentId(assignment.getId());
        response.setAssignmentTitle(assignment.getTitle());
        response.setStudentId(submission.getStudent().getId());
        response.setStudentName(displayName(submission.getStudent()));
        response.setScore(grade.getScore());
        response.setMaxScore(assignment.getMaxScore());
        response.setWeightedScore(grade.getScore() / assignment.getMaxScore() * assignment.getWeight());
        response.setFeedback(grade.getFeedback());
        response.setGradedAt(grade.getGradedAt());
        response.setGradedBy(grade.getGradedBy());
        return response;
    }

    private String displayName(User user) {
        return user.getFullName() != null ? user.getFullName() : user.getUsername();
    }
}
