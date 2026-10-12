package com.edulms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edulms.dto.AssignmentStatisticsResponse;
import com.edulms.dto.ClassAnalyticsResponse;
import com.edulms.dto.DashboardResponse;
import com.edulms.dto.GradeResponse;
import com.edulms.dto.StudentAnalyticsResponse;
import com.edulms.dto.StudentProgressResponse;
import com.edulms.entity.Assignment;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Grade;
import com.edulms.entity.Role;
import com.edulms.entity.Submission;
import com.edulms.entity.User;
import com.edulms.repository.AssignmentRepository;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.GradeRepository;
import com.edulms.repository.SubmissionRepository;
import com.edulms.repository.UserRepository;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private final ClassRepository classRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final GradeCalculator gradeCalculator;
    private final ProgressCalculator progressCalculator;
    private final ScoreDistributionCalculator scoreDistributionCalculator;

    public AnalyticsServiceImpl(
            ClassRepository classRepository,
            AssignmentRepository assignmentRepository,
            SubmissionRepository submissionRepository,
            EnrollmentRepository enrollmentRepository,
            GradeRepository gradeRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService,
            GradeCalculator gradeCalculator,
            ProgressCalculator progressCalculator,
            ScoreDistributionCalculator scoreDistributionCalculator) {
        this.classRepository = classRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRepository = gradeRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.gradeCalculator = gradeCalculator;
        this.progressCalculator = progressCalculator;
        this.scoreDistributionCalculator = scoreDistributionCalculator;
    }

    @Override
    public DashboardResponse getDashboard() {
        DashboardResponse response = new DashboardResponse();
        List<Grade> grades = gradeRepository.findAll();
        response.setClassCount(classRepository.count());
        response.setAssignmentCount(assignmentRepository.count());
        response.setSubmissionCount(submissionRepository.count());
        response.setGradedSubmissionCount(gradeRepository.count());
        response.setAverageScore(gradeCalculator.average(grades));
        return response;
    }

    @Override
    public ClassAnalyticsResponse getClassAnalytics(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        requireClassAnalyticsAccess(classEntity);

        List<Assignment> assignments = assignmentRepository.findByClassEntityIdOrderByDueDateAsc(classId);
        List<Grade> grades = gradeRepository.findBySubmissionAssignmentClassEntityId(classId);
        ClassAnalyticsResponse response = new ClassAnalyticsResponse();
        response.setClassId(classEntity.getId());
        response.setClassName(classEntity.getName());
        response.setStudentCount(enrollmentRepository.countByClassEntityId(classId));
        response.setAssignmentCount((long) assignments.size());
        response.setClassAverage(gradeCalculator.average(grades));
        response.setStudentProgress(enrollmentRepository.findByClassEntityId(classId).stream()
                .map(enrollment -> mapStudentProgress(enrollment.getStudent(), classId, assignments))
                .toList());
        response.setAssignmentStatistics(assignments.stream().map(this::mapAssignmentStatistics).toList());
        response.setScoreDistribution(scoreDistributionCalculator.calculate(grades));
        return response;
    }

    @Override
    public StudentAnalyticsResponse getStudentAnalytics(Long studentId, Long classId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        requireStudentAnalyticsAccess(student, classEntity);

        List<Assignment> assignments = assignmentRepository.findByClassEntityIdOrderByDueDateAsc(classId);
        List<Grade> grades = gradeRepository.findBySubmissionStudentIdAndSubmissionAssignmentClassEntityId(studentId, classId);
        StudentProgressResponse progress = mapStudentProgress(student, classId, assignments);

        StudentAnalyticsResponse response = new StudentAnalyticsResponse();
        response.setStudentId(student.getId());
        response.setStudentName(displayName(student));
        response.setAverageScore(gradeCalculator.average(grades));
        response.setCompletionRate(progress.getCompletionRate());
        response.setGrades(grades.stream().map(this::mapGradeToResponse).toList());
        return response;
    }

    private StudentProgressResponse mapStudentProgress(User student, Long classId, List<Assignment> assignments) {
        List<Long> assignmentIds = assignments.stream().map(Assignment::getId).toList();
        List<Submission> submissions = submissionRepository.findByStudentId(student.getId()).stream()
                .filter(submission -> assignmentIds.contains(submission.getAssignment().getId()))
                .toList();
        List<Grade> grades = gradeRepository.findBySubmissionStudentIdAndSubmissionAssignmentClassEntityId(student.getId(), classId);

        StudentProgressResponse response = new StudentProgressResponse();
        response.setStudentId(student.getId());
        response.setStudentName(displayName(student));
        response.setClassId(classId);
        response.setTotalAssignments(assignments.size());
        response.setSubmittedAssignments(submissions.size());
        response.setGradedAssignments(grades.size());
        response.setCompletionRate(progressCalculator.percent(submissions.size(), assignments.size()));
        response.setAverageScore(gradeCalculator.average(grades));
        return response;
    }

    private AssignmentStatisticsResponse mapAssignmentStatistics(Assignment assignment) {
        List<Submission> submissions = submissionRepository.findByAssignmentId(assignment.getId());
        List<Grade> grades = submissions.stream()
                .map(submission -> gradeRepository.findBySubmissionId(submission.getId()))
                .flatMap(java.util.Optional::stream)
                .toList();

        AssignmentStatisticsResponse response = new AssignmentStatisticsResponse();
        response.setAssignmentId(assignment.getId());
        response.setAssignmentTitle(assignment.getTitle());
        response.setSubmissionCount((long) submissions.size());
        response.setGradedCount((long) grades.size());
        response.setAverageScore(grades.isEmpty() ? 0.0 : grades.stream().mapToDouble(Grade::getScore).average().orElse(0.0));
        response.setMinScore(grades.isEmpty() ? 0.0 : grades.stream().mapToDouble(Grade::getScore).min().orElse(0.0));
        response.setMaxScore(grades.isEmpty() ? 0.0 : grades.stream().mapToDouble(Grade::getScore).max().orElse(0.0));
        return response;
    }

    private void requireClassAnalyticsAccess(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        enrollmentRepository.findByClassEntityIdAndStudentId(classEntity.getId(), user.getId())
                .orElseThrow(() -> new UnauthorizedClassAccessException("Bạn không có quyền xem thống kê lớp này"));
    }

    private void requireStudentAnalyticsAccess(User student, ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || student.getId().equals(user.getId()) || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        throw new UnauthorizedClassAccessException("Bạn không có quyền xem thống kê sinh viên này");
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
