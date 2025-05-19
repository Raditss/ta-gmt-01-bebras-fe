import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "./api"

export type User = {
  id: string
  username: string
  email: string
  points: number
  rank: number
  problemsSolved: number
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

        // Demo account logic
        if (
          (username === "RustRacer" && password === "password123")
        ) {
          set({
            user: {
              id: "demo-1",
              username: "RustRacer",
              email: "demo@codeleaf.com",
              points: 100,
              rank: 1,
              problemsSolved: 10,
            },
            token: "demo-token",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        }

        // Fallback to real API for other users
        try {
          const { user, token } = await api.login(username, password)
          set({
            user,
            token,
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
          const { user, token } = await api.register(email, username, password)
          set({
            user,
            token,
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
