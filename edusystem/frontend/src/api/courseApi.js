import axiosClient from "./axiosClient";
export const courseApi = { getAll: (params) => axiosClient.get("/courses", { params }), getById: (id) => axiosClient.get(`/courses/${id}`), create: (p) => axiosClient.post("/courses", p), update: (id, p) => axiosClient.put(`/courses/${id}`, p) };
