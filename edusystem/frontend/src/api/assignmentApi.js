import axiosClient from "./axiosClient";
export const assignmentApi = { getAll: (params) => axiosClient.get("/assignments", { params }), getById: (id) => axiosClient.get(`/assignments/${id}`), create: (p) => axiosClient.post("/assignments", p), update: (id, p) => axiosClient.put(`/assignments/${id}`, p) };
