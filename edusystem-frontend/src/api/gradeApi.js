import axiosClient from './axiosClient';

export const gradeApi = {
  gradeSubmission(submissionId, payload) {
    return axiosClient.put(`/api/grades/submissions/${submissionId}`, payload);
  },
  update(gradeId, payload) {
    return axiosClient.put(`/api/grades/${gradeId}`, payload);
  },
  bySubmission(submissionId) {
    return axiosClient.get(`/api/grades/submissions/${submissionId}`);
  },
  byStudentClass(studentId, classId) {
    return axiosClient.get(`/api/grades/students/${studentId}/classes/${classId}`);
  },
};
