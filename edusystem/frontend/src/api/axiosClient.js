import axios from "axios";
import { clearAuthStorage, getToken } from "../utils/tokenUtils";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" }
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) clearAuthStorage();
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
