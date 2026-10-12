import axiosClient from './axiosClient';

export const dashboardApi = {
  dashboard() {
    return axiosClient.get('/api/analytics/dashboard');
  },
  classAnalytics(classId) {
    return axiosClient.get(`/api/analytics/classes/${classId}`);
  },
  studentAnalytics(studentId, classId) {
    return axiosClient.get(`/api/analytics/students/${studentId}/classes/${classId}`);
  },
};
