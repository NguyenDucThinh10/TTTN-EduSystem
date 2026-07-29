package com.edulms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.Course;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.UserRepository;


@Service
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ClassServiceImpl(ClassRepository classRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ClassResponse createClass(ClassRequest request) {
        // 1. Tìm Course và Teacher từ DB
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên"));

        // 2. Tạo ClassEntity
        ClassEntity newClass = new ClassEntity();
        newClass.setCourse(course);
        newClass.setTeacher(teacher);
        newClass.setName(request.getName());
        newClass.setSemester(request.getSemester());
        newClass.setStatus(request.getStatus());

        // 3. Lưu vào database
        ClassEntity savedClass = classRepository.save(newClass);
        return mapToResponse(savedClass);
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Hàm phụ trợ map dữ liệu
    private ClassResponse mapToResponse(ClassEntity entity) {
        ClassResponse response = new ClassResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSemester(entity.getSemester());
        response.setStatus(entity.getStatus());
        response.setCourseTitle(entity.getCourse().getTitle()); // Lấy tên môn học
        
        // Ưu tiên hiển thị FullName, nếu null thì lấy Username
        String tName = entity.getTeacher().getFullName();
        response.setTeacherName(tName != null ? tName : entity.getTeacher().getUsername());
        
        return response;
    }
}