package com.edulms.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;

public interface ClassService {
    ClassResponse createClass(ClassRequest request);
    List<ClassResponse> getAllClasses();
    void enrollStudentsToClass(Long classId, List<Long> studentIds);
    String enrollStudentsFromExcel(Long classId, MultipartFile file);
}