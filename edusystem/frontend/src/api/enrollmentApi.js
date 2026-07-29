import axiosClient from "./axiosClient";
export const enrollmentApi = { enroll: (classroomId, studentId) => axiosClient.post(`/classrooms/${classroomId}/students`, { studentId }), remove: (classroomId, studentId) => axiosClient.delete(`/classrooms/${classroomId}/students/${studentId}`) };
