import axiosClient from "./axiosClient";
export const dashboardApi = { admin: () => axiosClient.get("/dashboard/admin"), teacher: () => axiosClient.get("/dashboard/teacher"), student: () => axiosClient.get("/dashboard/student") };
