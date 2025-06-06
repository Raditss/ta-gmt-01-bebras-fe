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

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER") => Promise<boolean>
  logout: () => void
  clearError: () => void
}

// Mock users for development without backend
const MOCK_USERS: Record<string, { user: User; token: string }> = {
  johndoe: {
    user: {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      role: "STUDENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: 5
    },
    token: "mock-token-student"
  },
  teacher: {
    user: {
      id: 2,
      username: "teacher",
      name: "Jane Smith",
      role: "TEACHER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: 10
    },
    token: "mock-token-teacher"
  },
  admin: {
    user: {
      id: 3,
      username: "admin",
      name: "Admin User",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: 15
    },
    token: "mock-token-admin"
  }
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
          // Mock login implementation
          const mockUser = MOCK_USERS[username]
          
          if (!mockUser || password !== "password123") {
            throw new Error("Invalid username or password")
          }

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500))

          set({
            user: mockUser.user,
            token: mockUser.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return true

          // Original backend implementation (commented)
          /*
          const response = await api.login(username, password)
          console.log('Login response:', response)
          console.log('Token being stored:', response.accessToken)
          set({
            user: response.user.props,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
          */
        } catch (error) {
          console.error('Login error:', error)
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
          // Mock register implementation
          if (MOCK_USERS[username]) {
            throw new Error("Username already exists")
          }

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500))

          // Add new mock user
          MOCK_USERS[username] = {
            user: {
              id: Object.keys(MOCK_USERS).length + 1,
              username,
              name,
              role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              streak: 0
            },
            token: `mock-token-${username}`
          }

          set({ isLoading: false })
          return true

          // Original backend implementation (commented)
          /*
          await api.register(username, password, name, role)
          set({ isLoading: false })
          return true
          */
        } catch (error) {
          console.error('Register error:', error)
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

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
    }
  )
)
