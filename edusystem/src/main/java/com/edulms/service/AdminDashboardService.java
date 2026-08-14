package com.edulms.service;

import org.springframework.stereotype.Service;

import com.edulms.dto.AdminDashboardResponse;
import com.edulms.entity.Role;
import com.edulms.repository.AssignmentRepository;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.GradeRepository;
import com.edulms.repository.SubmissionRepository;
import com.edulms.repository.UserRepository;

@Service
public class AdminDashboardService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final GradeRepository gradeRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            ClassRepository classRepository,
            AssignmentRepository assignmentRepository,
            SubmissionRepository submissionRepository,
            GradeRepository gradeRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.gradeRepository = gradeRepository;
    }

    public AdminDashboardResponse getDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalAdmins(userRepository.countByRole(Role.ADMIN));
        response.setTotalTeachers(userRepository.countByRole(Role.TEACHER));
        response.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        response.setTotalCourses(courseRepository.count());
        response.setTotalClasses(classRepository.count());
        response.setTotalAssignments(assignmentRepository.count());
        response.setTotalSubmissions(submissionRepository.count());
        response.setTotalGradedSubmissions(gradeRepository.count());
        return response;
    }
}
