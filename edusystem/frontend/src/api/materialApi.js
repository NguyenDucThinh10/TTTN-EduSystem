import axiosClient from "./axiosClient";
export const materialApi = { getByClassroom: (id) => axiosClient.get(`/classrooms/${id}/materials`), create: (p) => axiosClient.post("/materials", p), update: (id, p) => axiosClient.put(`/materials/${id}`, p), hide: (id) => axiosClient.patch(`/materials/${id}/hide`) };
