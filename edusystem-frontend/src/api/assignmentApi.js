import axiosClient from './axiosClient';

export const assignmentApi = {
  listByClass(classId) {
    return axiosClient.get(`/api/assignments/class/${classId}`);
  },
  detail(assignmentId) {
    return axiosClient.get(`/api/assignments/${assignmentId}`);
  },
  create(payload) {
    return axiosClient.post('/api/assignments', payload);
  },
  update(assignmentId, payload) {
    return axiosClient.put(`/api/assignments/${assignmentId}`, payload);
  },
  remove(assignmentId) {
    return axiosClient.delete(`/api/assignments/${assignmentId}`);
  },
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/api/files/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
