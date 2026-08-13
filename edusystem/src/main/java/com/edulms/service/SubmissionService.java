package com.edulms.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.SubmissionDetailResponse;
import com.edulms.dto.SubmissionResponse;
import com.edulms.dto.SubmissionStudentResponse;

public interface SubmissionService {
    SubmissionResponse submitAssignment(Long assignmentId, MultipartFile file);
    SubmissionResponse resubmitAssignment(Long assignmentId, MultipartFile file);
    void cancelSubmission(Long submissionId);
    List<SubmissionResponse> getMySubmissions();
    List<SubmissionResponse> getSubmissionsByAssignment(Long assignmentId);
    List<SubmissionStudentResponse> getSubmissionStudents(Long assignmentId);
    SubmissionDetailResponse getSubmissionDetail(Long submissionId);
}
