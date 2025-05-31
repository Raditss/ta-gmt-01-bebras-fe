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
  register: (username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER") => Promise<boolean>
  logout: () => Promise<void>
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

        try {
          const response = await api.login(username, password)
          console.log('Login response:', response) // Debug log
          console.log('Token being stored:', response.accessToken) // Debug log
          set({
            user: response.user.props,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch (error) {
          console.error('Login error:', error) // Debug log
          set({
            error: error instanceof Error ? error.message : "Failed to login",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          return false
        }
      },

      register: async (username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER") => {
        set({ isLoading: true, error: null })
        try {
          // Register the user without logging in
          await api.register(username, password, name, role)
          set({ isLoading: false })
          return true
        } catch (error) {
          console.error('Register error:', error) // Debug log
          set({
            error: error instanceof Error ? error.message : "Failed to register",
            isLoading: false,
          })
          return false
        }
      },

      logout: async () => {
        const state = useAuth.getState()
        if (state.token) {
          try {
            await api.logout(state.token)
          } catch (error) {
            // Log the error but continuing with local state cleanup
            console.warn("Error during logout:", error)
          }
        }
        // Always clear the local state, regardless of API call success
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
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
