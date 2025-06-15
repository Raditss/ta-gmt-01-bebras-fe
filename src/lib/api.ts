import { User } from "./auth"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-storage")
  if (token) {
    const parsedToken = JSON.parse(token).state.token
    if (parsedToken) {
      config.headers.Authorization = `Bearer ${parsedToken}`
    }
  }
  return config
})

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  name: string
  role: "ADMIN" | "STUDENT" | "TEACHER"
}

export interface AuthResponse {
  accessToken: string
  user: {
    props: User
  }
}

// Mock data for development without backend
const MOCK_QUESTIONS = [
  {
    props: {
      id: 1,
      content: "Sample CFG Question",
      questionTypeId: 1,
      teacherId: 2,
      isPublished: true,
      questionType: {
        id: 1,
        name: "Context-Free Grammar",
        description: "Transform shapes using grammar rules",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teacher: {
        id: 2,
        name: "Jane Smith"
      }
    }
  },
  {
    props: {
      id: 2,
      content: "Sample Decision Tree Question",
      questionTypeId: 2,
      teacherId: 2,
      isPublished: true,
      questionType: {
        id: 2,
        name: "Decision Tree",
        description: "Build and analyze decision trees",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teacher: {
        id: 2,
        name: "Jane Smith"
      }
    }
  }
]

const MOCK_QUESTION_TYPES = [
  {
    props: {
      id: 1,
      name: "Context-Free Grammar",
      description: "Transform shapes using grammar rules",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    props: {
      id: 2,
      name: "Decision Tree",
      description: "Build and analyze decision trees",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
]

export const api = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/login", {
      username,
      password,
    })
    return response.data
  },

  async register(username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER"): Promise<void> {
    await axiosInstance.post("/api/auth/register", {
      username,
      password,
      name,
      role,
    })
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/api/auth/logout")
  },

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<User>("/api/profile")
    return response.data
  },

  // Questions API
  async getQuestions() {
    const response = await axiosInstance.get("/api/questions")
    return response.data
  },

  async getQuestionById(id: string) {
    const response = await axiosInstance.get(`/api/questions/${id}`)
    return response.data
  },

  // Question Types API
  async getQuestionTypes() {
    const response = await axiosInstance.get("/api/question-types")
    return response.data
  },

  // Question Attempts API
  async createQuestionAttempt(questionId: number) {
    const response = await axiosInstance.post("/api/question-attempts", {
      questionId,
    })
    return response.data
  },

  async updateQuestionAttempt(id: string, answer: object) {
    const response = await axiosInstance.patch(`/api/question-attempts/${id}`, {
      answer,
    })
    return response.data
  }
}