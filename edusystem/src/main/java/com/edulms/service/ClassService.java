package com.edulms.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;
import com.edulms.dto.UserResponse;

public interface ClassService {
    ClassResponse createClass(ClassRequest request);

    List<ClassResponse> getAllClasses();

    List<ClassResponse> getMyClasses();

    List<ClassResponse> getOpenClassesForRegistration();

    ClassResponse getClassById(Long id);

    ClassResponse updateClass(Long id, ClassRequest request);

    List<UserResponse> getClassStudents(Long classId);

    void enrollStudentsToClass(Long classId, List<Long> studentIds);

    String enrollStudentsFromExcel(Long classId, MultipartFile file);

    List<UserResponse> getStudentsByClass(Long classId);

    void removeStudentFromClass(Long classId, Long studentId);

    ClassResponse selfEnroll(Long classId);

    void cancelSelfEnrollment(Long classId);
}
