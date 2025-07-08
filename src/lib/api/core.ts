import axios from "axios";

import {useAuthStore} from "@/store/auth.store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (
    config.url?.includes("/questions/new") ||
    config.url?.includes("questions/new")
  ) {
    throw new Error("BLOCKED: Main API call to /questions/new is not allowed.");
  }

  const token = localStorage.getItem("auth-storage");
  if (token) {
    const parsedToken = JSON.parse(token).state.token;
    if (parsedToken) {
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();

      console.error("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export const apiCore = {
  async get<T = unknown>(url: string) {
    if (url.includes("/questions/new") || url.includes("questions/new")) {
      throw new Error(
        "api.get: Cannot fetch question for new or temporary questions"
      );
    }

    return await axiosInstance.get<T>(`/api${url}`);
  },

  async post<T = unknown>(url: string, data?: unknown) {
    return await axiosInstance.post<T>(`/api${url}`, data);
  },

  async patch<T = unknown>(url: string, data?: unknown) {
    return await axiosInstance.patch<T>(`/api${url}`, data);
  },

  async delete<T = unknown>(url: string) {
    return await axiosInstance.delete<T>(`/api${url}`);
  },
};
