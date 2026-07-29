import axiosClient from "./axiosClient";
export const classroomApi = { getAll: (params) => axiosClient.get("/classrooms", { params }), getById: (id) => axiosClient.get(`/classrooms/${id}`), create: (p) => axiosClient.post("/classrooms", p), update: (id, p) => axiosClient.put(`/classrooms/${id}`, p) };
