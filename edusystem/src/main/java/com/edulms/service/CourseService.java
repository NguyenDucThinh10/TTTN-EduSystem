package com.edulms.service;

import java.util.List;

import com.edulms.dto.CourseRequest;
import com.edulms.dto.CourseResponse;

public interface CourseService {
    CourseResponse createCourse(CourseRequest request);
    List<CourseResponse> getAllCourses();
}