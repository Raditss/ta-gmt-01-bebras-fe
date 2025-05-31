import { User } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

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

export const api = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to login")
    }

    const data = await response.json()
    console.log('Login API Response:', data)
    return data
  },

  async register(username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER"): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, role }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to register")
    }

    const data = await response.json()
    console.log('Register API Response:', data)
  },

  async logout(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.warn("Logout request failed, but continuing with local state cleanup")
      }
    } catch (error) {
      console.warn("Error during logout:", error)
    }
  },

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get profile")
    }

    return response.json()
  },

  // Questions API
  async getQuestions(token: string) {
    const response = await fetch(`${API_URL}/api/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get questions")
    }

    return response.json()
  },

  async getQuestionById(token: string, id: string) {
    const response = await fetch(`${API_URL}/api/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get question")
    }

    return response.json()
  },

  // Question Types API
  async getQuestionTypes(token: string) {
    const response = await fetch(`${API_URL}/api/question-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get question types")
    }

    return response.json()
  },

  // Question Attempts API
  async createQuestionAttempt(token: string, questionId: number) {
    const response = await fetch(`${API_URL}/api/question-attempts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create question attempt")
    }

    return response.json()
  },

  async updateQuestionAttempt(token: string, id: string, answer: object) {
    const response = await fetch(`${API_URL}/api/question-attempts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update question attempt")
    }

    return response.json()
  },
}