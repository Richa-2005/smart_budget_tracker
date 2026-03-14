import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: "http://localhost:5500",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();

      toast.error("Session expired. Please login again.");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;