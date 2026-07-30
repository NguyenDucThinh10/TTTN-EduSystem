package com.edulms.service;

import com.edulms.dto.GradeResponse;
import com.edulms.dto.GradeSubmissionRequest;
import com.edulms.dto.StudentGradeResponse;
import com.edulms.dto.UpdateGradeRequest;

public interface GradeService {
    GradeResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request);
    GradeResponse updateGrade(Long gradeId, UpdateGradeRequest request);
    GradeResponse getGradeBySubmission(Long submissionId);
    StudentGradeResponse getStudentGrades(Long studentId, Long classId);
}
