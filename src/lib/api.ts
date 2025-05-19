import { User } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export const api = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
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

    return response.json()
  },

  async register(email: string, username: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to register")
    }

    return response.json()
  },

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
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
} 