import { gradeApi } from '../api/gradeApi';

export const gradeService = {
  bySubmission: gradeApi.bySubmission,
  byStudentClass: gradeApi.byStudentClass,
  saveSubmissionGrade(submissionId, values) {
    return gradeApi.gradeSubmission(submissionId, {
      score: Number(values.score),
      feedback: values.feedback || '',
    });
  },
  updateGrade(gradeId, values) {
    return gradeApi.update(gradeId, {
      score: Number(values.score),
      feedback: values.feedback || '',
    });
  },
};
