import axiosClient from "./axiosClient";
export const authApi = {
  login: (payload) => axiosClient.post("/auth/login", payload),
  register: (payload) => axiosClient.post("/auth/register", payload),
  me: () => axiosClient.get("/auth/me"),
  changePassword: (payload) => axiosClient.post("/auth/change-password", payload)
};
