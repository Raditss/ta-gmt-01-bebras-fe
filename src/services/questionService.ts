import axios from 'axios';
import { AttemptData } from "@/model/interfaces/question";
import { QuestionType } from "@/constants/questionTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance with authentication
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-storage");
  if (token) {
    try {
      const parsedToken = JSON.parse(token).state.token;
      if (parsedToken) {
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
    } catch (error) {
      console.warn('Failed to parse auth token:', error);
    }
  }
  return config;
});

// Question information without the full solve data
interface QuestionInfo {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  author: string;
  estimatedTime: number;
  points: number;
}

interface QuestionResponse {
  id: string;
  title: string;
  isGenerated: boolean;
  duration: number;
  type: QuestionType;
  content: string;
}

interface GeneratedAnswerCheck {
  questionId: string;
  type: QuestionType;
  duration: number;
  solution: string;
}

interface CheckResponse {
  isCorrect: boolean;
  points: number;
  streak: number;
}

// Helper function to get question type mapping
const getQuestionTypeFromBackend = (questionTypeId: number): QuestionType => {
  // This should be expanded based on your question types
  const typeMap: Record<number, QuestionType> = {
    1: 'cfg',
    2: 'decision-tree',
    3: 'cipher',
    4: 'cfg' // fallback
  };
  return typeMap[questionTypeId] || 'cfg';
};

export const questionService = {
  // Fetch question information by ID (without solve data)
  async getQuestionInfo(id: string): Promise<QuestionInfo> {
    const response = await api.get<QuestionInfo>(`/questions/${id}/info`);
    return response.data;
  },

  // Fetch full question data by ID (for solving)
  async getQuestionById(id: string): Promise<QuestionResponse> {
    const response = await api.get(`/questions/${id}`);
    const question = response.data.props; // Extract from props wrapper
    
    // Handle content - it might be JSON string or plain string
    let content: string;
    if (typeof question.content === 'string') {
      // Try to parse as JSON first, if it fails, use as plain string
      try {
        JSON.parse(question.content);
        content = question.content; // It's valid JSON, keep as string
      } catch {
        content = question.content; // It's plain text, keep as string
      }
    } else {
      content = JSON.stringify(question.content); // It's already an object
    }
    
    // Transform backend response to frontend format
    return {
      id: question.id.toString(),
      title: `Question ${question.id}`,
      isGenerated: false,
      duration: 0,
      type: getQuestionTypeFromBackend(question.questionTypeId),
      content: content,
    };
  },

  // Generate a random question
  async generateQuestion(type: QuestionType): Promise<QuestionResponse> {
    const response = await api.post<QuestionResponse>(`/questions/generate`, { type });
    return response.data;
  },

  // Save attempt progress
  async saveDraft(attempt: AttemptData): Promise<void> {
    await api.post('/question-attempts/save-draft', {
      questionId: parseInt(attempt.questionId),
      duration: attempt.duration,
      answer: JSON.parse(attempt.solution),
    });
    console.log('Draft saved to backend:', attempt);
  },

  // Save attempt synchronously (for beforeunload events)
  saveDraftSync(attempt: AttemptData): void {
    // For synchronous operations, we'll use navigator.sendBeacon if available
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        questionId: parseInt(attempt.questionId),
        duration: attempt.duration,
        answer: JSON.parse(attempt.solution),
      });
      
      navigator.sendBeacon(
        `${API_URL}/api/question-attempts/save-draft`,
        data
      );
      console.log('Draft saved synchronously via beacon:', attempt);
    } else {
      console.warn('navigator.sendBeacon not available, draft not saved synchronously');
    }
  },

  // Submit final attempt
  async submitAttempt(attempt: AttemptData): Promise<void> {
    const response = await api.post('/question-attempts/submit', {
      questionId: parseInt(attempt.questionId),
      duration: attempt.duration,
      answer: JSON.parse(attempt.solution),
    });
    
    console.log('Attempt submitted to backend:', response.data);
  },

  // Get attempt history for a question
  async getAttemptHistory(questionId: string): Promise<AttemptData[]> {
    const response = await api.get(`/question-attempts/history/${questionId}`);
    
    // Transform backend response to frontend format
    return response.data.map((attempt: { questionId: number; studentId: number; duration: number; isCompleted: boolean; answer: unknown }) => ({
      questionId: attempt.questionId.toString(),
      userId: attempt.studentId.toString(),
      duration: attempt.duration,
      status: attempt.isCompleted ? 'completed' : 'paused',
      solution: JSON.stringify(attempt.answer || {}),
    }));
  },

  // Get latest attempt for a question
  async getLatestAttempt(questionId: string): Promise<AttemptData | null> {
    try {
      const response = await api.get(`/question-attempts/latest/${questionId}`);
      
      if (!response.data) {
        return null;
      }
      
      // Transform backend response to frontend format
      return {
        questionId: response.data.questionId.toString(),
        userId: response.data.studentId.toString(),
        duration: response.data.duration,
        status: response.data.isCompleted ? 'completed' : 'paused',
        solution: JSON.stringify(response.data.answer || {}),
      };
    } catch {
      // Return null if no draft found or backend error
      return null;
    }
  },

  // Check answer for generated questions
  async checkGeneratedAnswer(data: GeneratedAnswerCheck): Promise<CheckResponse> {
    const response = await api.post('/question-attempts/check-generated-answer', data);
    console.log('Answer checked via backend:', response.data);
    return response.data;
  }
}; 