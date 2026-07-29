import axiosClient from "./axiosClient";
export const semesterApi = { getAll: () => axiosClient.get("/semesters"), save: (p) => axiosClient.post("/semesters", p), update: (id, p) => axiosClient.put(`/semesters/${id}`, p) };
