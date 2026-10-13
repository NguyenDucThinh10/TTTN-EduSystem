package com.edulms.service;

import java.util.List;

import com.edulms.dto.SubjectRequest;
import com.edulms.dto.SubjectResponse;

public interface SubjectService {
    SubjectResponse createSubject(SubjectRequest request);
    List<SubjectResponse> getAllSubjects();
    SubjectResponse updateSubject(Long id, SubjectRequest request);
    void deleteSubject(Long id);
}
