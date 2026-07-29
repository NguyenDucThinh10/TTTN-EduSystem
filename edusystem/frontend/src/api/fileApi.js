import axiosClient from "./axiosClient";
export const fileApi = { upload: (file) => { const data = new FormData(); data.append("file", file); return axiosClient.post("/files", data, { headers: { "Content-Type": "multipart/form-data" } }); }, download: (id) => axiosClient.get(`/files/${id}/download`, { responseType: "blob" }), info: (id) => axiosClient.get(`/files/${id}`) };
