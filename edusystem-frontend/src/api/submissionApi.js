import axiosClient from './axiosClient';

function fileFormData(file) {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

export const submissionApi = {
  submit(assignmentId, file) {
    return axiosClient.post(`/api/submissions/assignments/${assignmentId}`, fileFormData(file), multipartConfig);
  },
  resubmit(assignmentId, file) {
    return axiosClient.put(`/api/submissions/assignments/${assignmentId}`, fileFormData(file), multipartConfig);
  },
  cancel(submissionId) {
    return axiosClient.delete(`/api/submissions/${submissionId}`);
  },
  mySubmissions(classId) {
    return axiosClient.get('/api/submissions/me', {
      params: classId ? { classId } : undefined,
    });
  },
  listByAssignment(assignmentId) {
    return axiosClient.get(`/api/submissions/assignments/${assignmentId}`);
  },
  studentsByAssignment(assignmentId) {
    return axiosClient.get(`/api/submissions/assignments/${assignmentId}/students`);
  },
  detail(submissionId) {
    return axiosClient.get(`/api/submissions/${submissionId}`);
  },
};
