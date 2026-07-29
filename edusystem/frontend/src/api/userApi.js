import axiosClient from "./axiosClient";
export const userApi = { getAll: (params) => axiosClient.get("/users", { params }), getById: (id) => axiosClient.get(`/users/${id}`), create: (p) => axiosClient.post("/users", p), update: (id, p) => axiosClient.put(`/users/${id}`, p), remove: (id) => axiosClient.delete(`/users/${id}`) };
