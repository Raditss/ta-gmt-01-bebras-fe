import { User } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export interface SignInRequest {
  username: string
  password: string
}

export interface SignUpRequest {
  username: string
  password: string
  name: string
  role: "ADMIN" | "STUDENT" | "TEACHER"
}

export interface AuthResponse {
  access_token: {
    access_token: string
  }
  user: User
}

export const api = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/sign-in`, {
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

  async register(username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER"): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/sign-up`, {
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

    return response.json()
  },

  async signOut(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.warn("Sign out request failed, but continuing with local state cleanup")
      }
    } catch (error) {
      console.warn("Error during sign out:", error)
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
} 