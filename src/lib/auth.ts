// Mock authentication library
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    username: "RustRacer",
    email: "rust@example.com",
    password: "password123",
    points: 50,
    rank: 42,
    problemsSolved: 23,
  },
  {
    id: "2",
    username: "CodeWizard",
    email: "wizard@example.com",
    password: "password123",
    points: 2120,
    rank: 2,
    problemsSolved: 132,
  },
]

// Create auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find user with matching credentials
        const user = MOCK_USERS.find(
          (u) => (u.username === username || u.email === username) && u.password === password,
        )

        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
          })
          return true
        }

        return false
      },

      register: async (email: string, username: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user already exists
        if (MOCK_USERS.some((u) => u.username === username || u.email === email)) {
          return false
        }

        // Create new user (in a real app, this would be saved to a database)
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          username,
          email,
          points: 0,
          rank: 999,
          problemsSolved: 0,
        }

        set({
          user: newUser,
          isAuthenticated: true,
        })

        return true
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "codeleaf-auth",
    },
  ),
)
