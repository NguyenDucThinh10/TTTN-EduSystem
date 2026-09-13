package com.edulms.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.edulms.dto.GradeResponse;
import com.edulms.dto.GradeSubmissionRequest;
import com.edulms.dto.StudentGradeResponse;
import com.edulms.dto.UpdateGradeRequest;
import com.edulms.entity.Assignment;
import com.edulms.entity.Grade;
import com.edulms.entity.Role;
import com.edulms.entity.Submission;
import com.edulms.entity.SubmissionStatus;
import com.edulms.entity.User;
import com.edulms.repository.GradeRepository;
import com.edulms.repository.SubmissionRepository;
import com.edulms.repository.UserRepository;

@Service
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final GradeValidator gradeValidator;
    private final GradeCalculator gradeCalculator;

    public GradeServiceImpl(
            GradeRepository gradeRepository,
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService,
            GradeValidator gradeValidator,
            GradeCalculator gradeCalculator) {
        this.gradeRepository = gradeRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.gradeValidator = gradeValidator;
        this.gradeCalculator = gradeCalculator;
    }

    @Override
    public GradeResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request) {
        Submission submission = getSubmissionOrThrow(submissionId);
        requireTeacherOfSubmission(submission);
        gradeValidator.validate(request.getScore(), submission.getAssignment().getMaxScore());

        Grade grade = gradeRepository.findBySubmissionId(submissionId).orElseGet(Grade::new);
        grade.setSubmission(submission);
        grade.setScore(request.getScore());
        grade.setFeedback(request.getFeedback());
        grade.setGradedAt(LocalDateTime.now());
        grade.setGradedBy(currentUserService.getCurrentUser().getUsername());

        syncSubmissionGrade(submission, request.getScore(), request.getFeedback(), grade.getGradedAt());
        submissionRepository.save(submission);
        return mapToResponse(gradeRepository.save(grade));
    }

    @Override
    public GradeResponse updateGrade(Long gradeId, UpdateGradeRequest request) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy điểm"));
        requireTeacherOfSubmission(grade.getSubmission());
        gradeValidator.validate(request.getScore(), grade.getSubmission().getAssignment().getMaxScore());

        grade.setScore(request.getScore());
        grade.setFeedback(request.getFeedback());
        grade.setGradedAt(LocalDateTime.now());
        grade.setGradedBy(currentUserService.getCurrentUser().getUsername());
        syncSubmissionGrade(grade.getSubmission(), request.getScore(), request.getFeedback(), grade.getGradedAt());
        submissionRepository.save(grade.getSubmission());
        return mapToResponse(gradeRepository.save(grade));
    }

    @Override
    public GradeResponse getGradeBySubmission(Long submissionId) {
        Submission submission = getSubmissionOrThrow(submissionId);
        requireGradeAccess(submission);
        Grade grade = gradeRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài nộp chưa được chấm điểm"));
        return mapToResponse(grade);
    }

    @Override
    public StudentGradeResponse getMyGrades() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() != Role.STUDENT) {
            throw new UnauthorizedClassAccessException("Chi sinh vien duoc xem bang diem cua minh");
        }
        return buildStudentGradeResponse(user, null, gradeRepository.findBySubmissionStudentId(user.getId()));
    }

    @Override
    public StudentGradeResponse getStudentGrades(Long studentId, Long classId) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.STUDENT && !user.getId().equals(studentId)) {
            throw new UnauthorizedClassAccessException("Sinh viên chỉ được xem điểm của chính mình");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        List<Grade> grades = gradeRepository.findBySubmissionStudentIdAndSubmissionAssignmentClassEntityId(studentId, classId);
        return buildStudentGradeResponse(student, classId, grades);
    }

    private StudentGradeResponse buildStudentGradeResponse(User student, Long classId, List<Grade> grades) {
        StudentGradeResponse response = new StudentGradeResponse();
        response.setStudentId(student.getId());
        response.setStudentName(displayName(student));
        response.setClassId(classId);
        response.setClassName(grades.isEmpty() ? null : grades.get(0).getSubmission().getAssignment().getClassEntity().getName());
        response.setAverageScore(gradeCalculator.average(grades));
        response.setGrades(grades.stream().map(this::mapToResponse).toList());
        return response;
    }

    private void syncSubmissionGrade(Submission submission, Double score, String feedback, LocalDateTime gradedAt) {
        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setGradedAt(gradedAt);
        submission.setStatus(SubmissionStatus.GRADED);
    }

    private void requireTeacherOfSubmission(Submission submission) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (user.getRole() != Role.TEACHER || !submission.getAssignment().getClassEntity().getTeacher().getId().equals(user.getId())) {
            throw new UnauthorizedClassAccessException("Bạn không có quyền chấm bài nộp này");
        }
    }

    private void requireGradeAccess(Submission submission) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || submission.getStudent().getId().equals(user.getId())) {
            return;
        }
        requireTeacherOfSubmission(submission);
    }

    private Submission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài nộp"));
    }

    private GradeResponse mapToResponse(Grade grade) {
        Submission submission = grade.getSubmission();
        Assignment assignment = submission.getAssignment();
        var classEntity = assignment.getClassEntity();
        var course = classEntity.getCourse();
        GradeResponse response = new GradeResponse();
        response.setId(grade.getId());
        response.setSubmissionId(submission.getId());
        response.setAssignmentId(assignment.getId());
        response.setAssignmentTitle(assignment.getTitle());
        response.setClassId(classEntity.getId());
        response.setClassName(classEntity.getName());
        response.setSemester(classEntity.getSemester());
        response.setCourseId(course.getId());
        response.setCourseCode(course.getCode());
        response.setCourseTitle(course.getTitle());
        response.setCourseCredits(course.getCredits());
        response.setStudentId(submission.getStudent().getId());
        response.setStudentName(displayName(submission.getStudent()));
        response.setScore(grade.getScore());
        response.setMaxScore(assignment.getMaxScore());
        response.setWeightedScore(gradeCalculator.weightedScore(grade));
        response.setFeedback(grade.getFeedback());
        response.setGradedAt(grade.getGradedAt());
        response.setGradedBy(grade.getGradedBy());
        return response;
    }

    private String displayName(User user) {
        return user.getFullName() != null ? user.getFullName() : user.getUsername();
    }
}
