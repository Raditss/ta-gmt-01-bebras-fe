import { User } from "./auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  console.log('🚨 DEBUG: Main API axios interceptor:', config.method?.toUpperCase(), config.url);
  
  // Block any API calls that contain "/new" in the questions endpoint
  if (config.url?.includes('/questions/new') || config.url?.includes('questions/new')) {
    console.log('🚨 DEBUG: MAIN API BLOCKING API CALL TO /questions/new');
    console.log('🚨 DEBUG: Full config:', config);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    throw new Error('BLOCKED: Main API call to /questions/new is not allowed.');
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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  role: "ADMIN" | "STUDENT" | "TEACHER";
}

export interface AuthResponse {
  accessToken: string;
  user: {
    props: User;
  };
}

export interface QuestionType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Difficulty {
  value: string;
  label: string;
}

export const api = {
  // Generic HTTP methods for direct use
  async get<T = any>(url: string) {
    console.log('🚨 DEBUG: api.get called with URL:', url);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    // Safeguard: Block calls for "new" questions
    if (url.includes('/questions/new') || url.includes('questions/new')) {
      throw new Error('api.get: Cannot fetch question for new or temporary questions');
    }
    
    const response = await axiosInstance.get<T>(`/api${url}`);
    console.log('🚨 DEBUG: api.get response:', response.data);
    return response;
  },

  async post<T = any>(url: string, data?: any) {
    console.log('🚨 DEBUG: api.post called with URL:', url, 'Data:', data);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    const response = await axiosInstance.post<T>(`/api${url}`, data);
    console.log('🚨 DEBUG: api.post response:', response.data);
    return response;
  },

  async patch<T = any>(url: string, data?: any) {
    console.log('🚨 DEBUG: api.patch called with URL:', url, 'Data:', data);
    const response = await axiosInstance.patch<T>(`/api${url}`, data);
    return response;
  },

  async delete<T = any>(url: string) {
    console.log('🚨 DEBUG: api.delete called with URL:', url);
    const response = await axiosInstance.delete<T>(`/api${url}`);
    return response;
  },

  // Auth API
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  async register(
    username: string,
    password: string,
    name: string,
    role: "ADMIN" | "STUDENT" | "TEACHER"
  ): Promise<void> {
    await axiosInstance.post("/api/auth/register", {
      username,
      password,
      name,
      role,
    });
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/api/auth/logout");
  },

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<User>("/api/profile");
    return response.data;
  },

  // Questions API
  async getQuestions() {
    const response = await axiosInstance.get("/api/questions");
    return response.data;
  },

  async getQuestionById(id: string) {
    console.log('🚨 DEBUG: api.getQuestionById called with ID:', id);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    // Safeguard: Block calls for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      throw new Error('api.getQuestionById: Cannot fetch question for new or temporary questions');
    }
    
    const response = await axiosInstance.get(`/api/questions/${id}`);
    return response.data;
  },

  // Question Types API
  async getQuestionTypes(): Promise<QuestionType[]> {
    console.log('🔍 DEBUG: Calling /api/metadata/question-types...');
    const response = await axiosInstance.get("/api/metadata/question-types");
    console.log('🔍 DEBUG: getQuestionTypes response.data:', response.data);
    return response.data;
  },

  // Question Attempts API
  async createQuestionAttempt(questionId: number) {
    const response = await axiosInstance.post("/api/question-attempts", {
      questionId,
    });
    return response.data;
  },

  async updateQuestionAttempt(id: string, answer: object) {
    const response = await axiosInstance.patch(`/api/question-attempts/${id}`, {
      answer,
    });
    return response.data;
  },

  async getDifficulties(): Promise<Difficulty[]> {
    const response = await axiosInstance.get("/api/metadata/difficulties");
    return response.data;
  },
};
