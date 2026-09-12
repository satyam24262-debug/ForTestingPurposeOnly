import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,
});

export const sign = (data) => {
  return api.post("api/register", data);
};

export const log = (data) => {
  return api.post("api/login", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("myjobtoken");
//   console.log(token);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const updateProfile = (data) => {
  return api.post("api/profile/update", data, {
    withCredentials: true,
  });
};

export const logout = (user) => {
  return api.post("api/logout", user, { withCredentials: true });
};

export const getJobs = (filters = {}) =>
  api.get("api/getJobs", { params: filters });
export const getRecommendedJobs = () => api.get("api/getRecommendedJobs");
export const askAssistant = (question) =>
  api.post("api/assistant", { question });
export const getJobById = (id) => api.get(`api/getJobById/${id}`);
export const postJob = (data) => api.post("api/postJob", data);
export const applyJob = (id) => api.post(`api/applyJob/${id}`);
export const getAppliedJobs = () => api.get("api/getAppliedJobs");
export const getAdminJobs = () => api.get("api/getAdminJobs");
export const getCompanies = () => api.get("api/getCompany");
export const getAllCompanies = () => api.get("api/getAllCompanies");
export const registerCompany = (data) =>
  api.post("api/registerInCompany", data);
export const getApplicationsForJob = (id) =>
  api.get(`api/getApplicationByAdmin/${id}`);
export const updateApplicationStatus = (id, status) =>
  api.post(`api/updateStatus/${id}`, { status });
