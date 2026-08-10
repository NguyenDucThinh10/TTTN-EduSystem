package com.edulms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Course;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.UserRepository;

@Service
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CurrentUserService currentUserService;

    public ClassServiceImpl(
            ClassRepository classRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            CurrentUserService currentUserService) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public ClassResponse createClass(ClassRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay mon hoc"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay giang vien"));

        ClassEntity newClass = new ClassEntity();
        newClass.setCourse(course);
        newClass.setTeacher(teacher);
        newClass.setName(request.getName());
        newClass.setSemester(request.getSemester());
        newClass.setStatus(request.getStatus());

        return mapToResponse(classRepository.save(newClass));
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponse> getMyClasses() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return getAllClasses();
        }
        if (user.getRole() == Role.TEACHER) {
            return classRepository.findByTeacherId(user.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return enrollmentRepository.findByStudentId(user.getId()).stream()
                .map(enrollment -> mapToResponse(enrollment.getClassEntity()))
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponse getClassById(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        requireClassAccess(classEntity);
        return mapToResponse(classEntity);
    }

    private void requireClassAccess(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        enrollmentRepository.findByClassEntityIdAndStudentId(classEntity.getId(), user.getId())
                .orElseThrow(() -> new UnauthorizedClassAccessException("Ban khong thuoc lop hoc nay"));
    }

    private ClassResponse mapToResponse(ClassEntity entity) {
        ClassResponse response = new ClassResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSemester(entity.getSemester());
        response.setStatus(entity.getStatus());
        response.setCourseTitle(entity.getCourse().getTitle());

        String teacherName = entity.getTeacher().getFullName();
        response.setTeacherName(teacherName != null ? teacherName : entity.getTeacher().getUsername());

        return response;
    }
}
