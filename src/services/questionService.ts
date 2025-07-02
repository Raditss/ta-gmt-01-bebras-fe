import { AttemptData } from "@/model/interfaces/question";
import { QuestionType } from "@/constants/questionTypes";
import { Question } from "@/model/cfg/question/model";
import { api } from "@/lib/api";

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

// Question information without the full solve data
export interface QuestionInfo {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: "Easy" | "Medium" | "Hard";
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

export interface CheckResponse {
  isCorrect: boolean;
  points: number;
  streak: number;
}



export const questionService = {
  // Fetch question information by ID (without solve data)
  async getQuestionInfo(id: string): Promise<QuestionInfo> {
    console.log('🚨 DEBUG: questionService.getQuestionInfo called with ID:', id);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    // Safeguard: Block calls for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      throw new Error('questionService.getQuestionInfo: Cannot fetch info for new or temporary questions');
    }
    
    try {
      console.log('🚨 DEBUG: About to call api.get for question info');
      const response = await api.get<QuestionInfo>(`/questions/${id}/info`);
      console.log('🚨 DEBUG: Successfully got question info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('🚨 DEBUG: Error in questionService.getQuestionInfo:', error);
      throw error;
    }
  },

  // Fetch full question data by ID (for solving)
  async getQuestionById(id: string): Promise<QuestionResponse> {
    console.log('🚨 DEBUG: questionService.getQuestionById called with ID:', id);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    // Safeguard: Block calls for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      throw new Error('questionService.getQuestionById: Cannot fetch question for new or temporary questions');
    }
    
    try {
      console.log('🚨 DEBUG: About to call api.get for full question');
      const response = await api.get(`/questions/${id}`);
      console.log('🚨 DEBUG: Successfully got question response:', response.data);
      
      const question = response.data.props; // Extract from props wrapper
      console.log('🚨 DEBUG: Extracted question from props:', question);
      
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
      const result = {
        id: question.id.toString(),
        title: `Question ${question.id}`,
        isGenerated: false,
        duration: 0,
        type: getQuestionTypeFromBackend(question.questionTypeId),
        content: content,
      };
      
      console.log('🚨 DEBUG: Transformed question result:', result);
      return result;
    } catch (error) {
      console.error('🚨 DEBUG: Error in questionService.getQuestionById:', error);
      throw error;
    }
  },

  // Generate a random question
  async generateQuestion(type: QuestionType): Promise<QuestionResponse> {
    const response = await api.post<QuestionResponse>(`/questions/generate`, { type });
    return response.data;
  },

  // Save attempt progress
  async saveDraft(attempt: AttemptData): Promise<void> {
    console.log('🚨 DEBUG: questionService.saveDraft called with attempt:', attempt);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    try {
      const payload = {
        questionId: parseInt(attempt.questionId),
        duration: attempt.duration,
        answer: JSON.parse(attempt.solution),
      };
      console.log('🚨 DEBUG: saveDraft payload:', payload);
      
      const response = await api.post('/question-attempts/save-draft', payload);
      console.log('🚨 DEBUG: saveDraft response:', response.data);
      console.log('Draft saved to backend successfully:', attempt);
    } catch (error) {
      console.error('🚨 DEBUG: Error in saveDraft:', error);
      throw error;
    }
  },

  // Save attempt synchronously (for beforeunload events)
  saveDraftSync(attempt: AttemptData): void {
    console.log('🚨 DEBUG: questionService.saveDraftSync called with attempt:', attempt);
    
    // For synchronous operations, we'll use navigator.sendBeacon if available
    if (navigator.sendBeacon) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      try {
        const payload = {
          questionId: parseInt(attempt.questionId),
          duration: attempt.duration,
          answer: JSON.parse(attempt.solution),
        };
        console.log('🚨 DEBUG: saveDraftSync payload:', payload);
        
        const data = JSON.stringify(payload);
        
        const success = navigator.sendBeacon(
          `${API_URL}/api/question-attempts/save-draft`,
          data
        );
        console.log('🚨 DEBUG: sendBeacon success:', success);
        console.log('Draft saved synchronously via beacon:', attempt);
      } catch (error) {
        console.error('🚨 DEBUG: Error in saveDraftSync:', error);
      }
    } else {
      console.warn('navigator.sendBeacon not available, draft not saved synchronously');
    }
  },

  // Submit final attempt
  async submitAttempt(attempt: AttemptData): Promise<void> {
    console.log('🚨 DEBUG: questionService.submitAttempt called with attempt:', attempt);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    try {
      const payload = {
        questionId: parseInt(attempt.questionId),
        duration: attempt.duration,
        answer: JSON.parse(attempt.solution),
      };
      console.log('🚨 DEBUG: submitAttempt payload:', payload);
      
      const response = await api.post('/question-attempts/submit', payload);
      console.log('🚨 DEBUG: submitAttempt response:', response.data);
      console.log('Attempt submitted to backend successfully:', response.data);
    } catch (error) {
      console.error('🚨 DEBUG: Error in submitAttempt:', error);
      throw error;
    }
  },

  // Get attempt history for a question
  async getAttemptHistory(questionId: string): Promise<AttemptData[]> {
    console.log('🚨 DEBUG: questionService.getAttemptHistory called with questionId:', questionId);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    try {
      const response = await api.get(`/question-attempts/history/${questionId}`);
      console.log('🚨 DEBUG: getAttemptHistory response:', response.data);
      
      // Transform backend response to frontend format
      const transformed = response.data.map((attempt: { questionId: number; studentId: number; duration: number; isCompleted: boolean; answer: unknown }) => ({
        questionId: attempt.questionId.toString(),
        userId: attempt.studentId.toString(),
        duration: attempt.duration,
        status: attempt.isCompleted ? 'completed' : 'paused',
        solution: JSON.stringify(attempt.answer || {}),
      }));
      
      console.log('🚨 DEBUG: getAttemptHistory transformed result:', transformed);
      return transformed;
    } catch (error) {
      console.error('🚨 DEBUG: Error in getAttemptHistory:', error);
      throw error;
    }
  },

  // Get latest attempt for a question
  async getLatestAttempt(questionId: string): Promise<AttemptData | null> {
    console.log('🚨 DEBUG: questionService.getLatestAttempt called with questionId:', questionId);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    try {
      const response = await api.get(`/question-attempts/latest/${questionId}`);
      console.log('🚨 DEBUG: getLatestAttempt response:', response.data);
      
      if (!response.data) {
        console.log('🚨 DEBUG: No latest attempt found, returning null');
        return null;
      }
      
      // Transform backend response to frontend format
      const transformed = {
        questionId: response.data.questionId.toString(),
        userId: response.data.studentId.toString(),
        duration: response.data.duration,
        status: response.data.isCompleted ? 'completed' : 'paused',
        solution: JSON.stringify(response.data.answer || {}),
      };
      
      console.log('🚨 DEBUG: getLatestAttempt transformed result:', transformed);
      return transformed;
    } catch (error) {
      console.error('🚨 DEBUG: Error in getLatestAttempt:', error);
      // Return null if no draft found or backend error
      return null;
    }
  },

  // Check answer for generated questions
  async checkGeneratedAnswer(data: GeneratedAnswerCheck): Promise<CheckResponse> {
    console.log('🚨 DEBUG: questionService.checkGeneratedAnswer called with data:', data);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    
    try {
      const response = await api.post('/question-attempts/check-generated-answer', data);
      console.log('🚨 DEBUG: checkGeneratedAnswer response:', response.data);
      console.log('Answer checked via backend successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🚨 DEBUG: Error in checkGeneratedAnswer:', error);
      throw error;
    }
  }
};
