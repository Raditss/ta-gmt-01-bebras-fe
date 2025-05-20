import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "./api"

export type User = {
  id: number
  username: string
  name: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
  createdAt: string
  updatedAt: string
  streak: number
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

// Create auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })

        // Demo accounts logic
        if (username === "johndoe" && password === "password123") {
          set({
            user: {
              id: 1,
              username: "johndoe",
              name: "John Doe",
              role: "STUDENT",
              createdAt: "2025-05-20T08:19:32.290Z",
              updatedAt: "2025-05-20T08:19:32.290Z",
              streak: 25
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzQ3NzMxNTQwLCJleHAiOjE3NDc3NzQ3NDB9.-11U9HL_IHcEO6fGjaAn-j6GIDKQCPVkCbyxH7PDSAE",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        }

        // Demo teacher account
        if (username === "teacher" && password === "password123") {
          set({
            user: {
              id: 2,
              username: "teacher",
              name: "Sarah Smith",
              role: "TEACHER",
              createdAt: "2025-05-20T08:19:32.290Z",
              updatedAt: "2025-05-20T08:19:32.290Z",
              streak: 15
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoidGVhY2hlciIsInJvbGUiOiJURUFDSEVSIiwiaWF0IjoxNzQ3NzMxNTQwLCJleHAiOjE3NDc3NzQ3NDB9.teacher-token",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        }

        // Demo admin account
        if (username === "admin" && password === "password123") {
          set({
            user: {
              id: 3,
              username: "admin",
              name: "Admin User",
              role: "ADMIN",
              createdAt: "2025-05-20T08:19:32.290Z",
              updatedAt: "2025-05-20T08:19:32.290Z",
              streak: 30
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc3MzE1NDAsImV4cCI6MTc0Nzc3NDc0MH0.admin-token",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        }

        // Fallback to real API for other users
        try {
          const response = await api.login(username, password)
          set({
            user: response.user,
            token: response.access_token.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to login",
            isLoading: false,
          })
          return false
        }
      },

      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.register(email, username, password)
          set({
            user: response.user,
            token: response.access_token.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to register",
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "codeleaf-auth",
    },
  ),
)
