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
  // The login and register functions are now handled in auth.ts with mock data
  async login(username: string, password: string): Promise<AuthResponse> {
    throw new Error("Login is handled by mock implementation in auth.ts")
  },

  async register(username: string, password: string, name: string, role: "ADMIN" | "STUDENT" | "TEACHER"): Promise<void> {
    throw new Error("Register is handled by mock implementation in auth.ts")
  },

  async logout(token: string): Promise<void> {
    // No need to do anything in mock implementation
    return
  },

  async getProfile(token: string): Promise<User> {
    // Mock implementation - return user based on token
    const mockUser: User = {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      role: "STUDENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: 5
    }
    return mockUser

    // Original implementation
    /*
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
    */
  },

  // Questions API
  async getQuestions(token: string) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return MOCK_QUESTIONS

    // Original implementation
    /*
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
    */
  },

  async getQuestionById(token: string, id: string) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    const question = MOCK_QUESTIONS.find(q => q.props.id.toString() === id)
    if (!question) {
      throw new Error("Question not found")
    }
    return question

    // Original implementation
    /*
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
    */
  },

  // Question Types API
  async getQuestionTypes(token: string) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return MOCK_QUESTION_TYPES

    // Original implementation
    /*
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
    */
  },

  // Question Attempts API
  async createQuestionAttempt(token: string, questionId: number) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return {
      id: Math.random().toString(36).substr(2, 9),
      questionId,
      startTime: new Date().toISOString(),
      status: "in_progress"
    }

    // Original implementation
    /*
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
    */
  },

  async updateQuestionAttempt(token: string, id: string, answer: object) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return {
      id,
      status: "completed",
      answer
    }

    // Original implementation
    /*
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
    */
  }
}