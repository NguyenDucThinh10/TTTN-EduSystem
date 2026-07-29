import axiosClient from "./axiosClient";
export const gradeApi = { getAll: (params) => axiosClient.get("/grades", { params }), save: (p) => axiosClient.post("/grades", p), publish: (classroomId) => axiosClient.patch(`/classrooms/${classroomId}/grades/publish`) };
