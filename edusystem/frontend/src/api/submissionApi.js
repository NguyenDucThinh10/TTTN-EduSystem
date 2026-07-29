import axiosClient from "./axiosClient";
export const submissionApi = { getAll: (params) => axiosClient.get("/submissions", { params }), getById: (id) => axiosClient.get(`/submissions/${id}`), submit: (p) => axiosClient.post("/submissions", p) };
