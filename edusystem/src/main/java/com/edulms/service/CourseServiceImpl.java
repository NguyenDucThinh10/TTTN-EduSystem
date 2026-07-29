package com.edulms.service;

import com.edulms.dto.CourseRequest;
import com.edulms.dto.CourseResponse;
import com.edulms.entity.Course;
import com.edulms.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        course.setCode(request.getCode()); // Lấy code
        course.setTitle(request.getTitle()); // Lấy title
        course.setCredits(request.getCredits()); // Lấy credits

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Hàm phụ trợ map dữ liệu
    private CourseResponse mapToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setCredits(course.getCredits());
        return response;
    }
}