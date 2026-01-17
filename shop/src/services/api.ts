import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.404tears.kz/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    toast.error(err.response?.data?.detail || "Server error");
    return Promise.reject(err);
  }
);

export default api;
