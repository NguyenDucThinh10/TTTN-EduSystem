package com.edulms.service;

import java.util.List;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;

public interface ClassService {
    ClassResponse createClass(ClassRequest request);
    List<ClassResponse> getAllClasses();
}