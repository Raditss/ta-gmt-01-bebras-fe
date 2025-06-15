import { QuestionType } from '@/constants/questionTypes';
import axios from 'axios';

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

export interface CreationData {
  questionId: string;
  creatorId: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  estimatedTime: number;
  author: string;
  questionType: QuestionType;
  content: string; // JSON string of question-specific data
  isDraft: boolean;
  lastModified: Date;
  hasContent?: boolean; // Optional field for validation
}

export interface CreationInfo {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  estimatedTime: number;
  author: string;
  isDraft: boolean;
  lastModified: Date;
}

// Helper function to transform backend question type ID to frontend type
const getQuestionTypeFromBackend = (questionTypeId: number): QuestionType => {
  const typeMap: Record<number, QuestionType> = {
    1: 'cfg',
    2: 'decision-tree',
    3: 'cipher',
    4: 'cfg' // fallback
  };
  return typeMap[questionTypeId] || 'cfg';
};

export const creationService = {
  // Create a new question creation session
  async createQuestion(
    creatorId: string,
    questionType: QuestionType,
    initialData: {
      title: string;
      description: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      category: string;
      points: number;
      estimatedTime: number;
      author: string;
    }
  ): Promise<CreationData> {
    // Map question type to backend type ID
    const typeIdMap: Record<QuestionType, number> = {
      'cfg': 1,
      'decision-tree': 2,
      'cipher': 3
    };
    
    const response = await api.post('/questions', {
      questionTypeId: typeIdMap[questionType],
      content: '{}', // Empty content initially as string
      isPublished: false // Start as draft
    });
    
    console.log('Create question response:', response.data);
    
    const question = response.data;
    
    // Handle different response formats
    if (!question) {
      throw new Error('No question data received from server');
    }
    
    // Check if question has required fields
    if (!question.id) {
      console.error('Question response missing id:', question);
      throw new Error('Invalid question response: missing id');
    }
    
    if (!question.createdAt) {
      console.error('Question response missing createdAt:', question);
      throw new Error('Invalid question response: missing createdAt');
    }
    
    return {
      questionId: question.id.toString(),
      creatorId,
      ...initialData,
      questionType,
      content: '{}',
      isDraft: true,
      lastModified: new Date(question.createdAt)
    };
  },

  // Fetch creation info by ID
  async getCreationInfo(id: string): Promise<CreationInfo> {
    const response = await api.get(`/questions/${id}/info`);
    const question = response.data; // This endpoint returns direct format
    
    return {
      id: question.id.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      type: getQuestionTypeFromBackend(question.questionTypeId),
      difficulty: 'Medium', // Default, should come from question metadata
      category: 'General', // Default, should come from question metadata
      points: 100, // Default, should come from question metadata
      estimatedTime: 15, // Default, should come from question metadata
      author: question.teacher?.name || 'Unknown',
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    };
  },

  // Fetch full creation data by ID
  async getCreationData(id: string): Promise<CreationData> {
    console.log('📥 GET CREATION DATA - Fetching question ID:', id);
    
    const response = await api.get(`/questions/${id}`);
    console.log('📥 BACKEND RESPONSE - Raw response:', response.data);
    
    const question = response.data.props; // Extract from props wrapper
    console.log('📥 EXTRACTED QUESTION - Question data:', question);
    
    // Check if question is already published/submitted
    if (question.isPublished) {
      throw new Error('QUESTION_ALREADY_SUBMITTED');
    }
    
    const processedContent = typeof question.content === 'string' ? question.content : JSON.stringify(question.content);
    console.log('📥 PROCESSED CONTENT:', {
      originalContent: question.content,
      originalType: typeof question.content,
      processedContent: processedContent,
      processedLength: processedContent?.length || 0
    });
    
    const creationData = {
      questionId: question.id.toString(),
      creatorId: question.teacherId.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard', // Default, should come from question metadata
      category: 'General', // Default, should come from question metadata
      points: 100, // Default, should come from question metadata
      estimatedTime: 15, // Default, should come from question metadata
      author: question.teacher?.name || 'Unknown',
      questionType: getQuestionTypeFromBackend(question.questionTypeId),
      content: processedContent,
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    };
    
    console.log('📥 FINAL CREATION DATA:', creationData);
    return creationData;
  },

  // Save creation progress as draft
  async saveDraft(creation: CreationData): Promise<CreationData> {
    console.log('🔄 SAVE DRAFT - Starting with creation data:', {
      questionId: creation.questionId,
      title: creation.title,
      isTemp: creation.questionId.startsWith('temp-')
    });

    // If we have a temporary ID, we need to create the question first
    if (creation.questionId.startsWith('temp-')) {
      console.log('🆕 CREATING NEW QUESTION - Temporary ID detected:', creation.questionId);
      
      // Map question type to backend type ID
      const typeIdMap: Record<QuestionType, number> = {
        'cfg': 1,
        'decision-tree': 2,
        'cipher': 3
      };
      
      const requestData = {
        questionTypeId: typeIdMap[creation.questionType],
        content: creation.content, // Send as string, not parsed object
        isPublished: false // Start as draft
      };
      
      console.log('📤 BACKEND REQUEST - Creating question with data:', requestData);
      
      const response = await api.post('/questions', requestData);
      
      console.log('📥 BACKEND RESPONSE - Question created:', response.data);
      
      const newQuestion = response.data;
      
      // Return updated creation data with real ID
      const updatedCreation = {
        ...creation,
        questionId: newQuestion.id.toString(),
        lastModified: new Date(newQuestion.createdAt)
      };
      
      console.log('✅ NEW QUESTION CREATED - Updated creation data:', {
        oldId: creation.questionId,
        newId: updatedCreation.questionId,
        backendId: newQuestion.id
      });
      
      return updatedCreation;
    } else {
      console.log('📝 UPDATING EXISTING QUESTION - ID:', creation.questionId);
      
      // Update existing question
      const updateData = {
        content: creation.content, // Send as string, not parsed object
        isPublished: false // Keep as draft
      };
      
      console.log('📤 BACKEND UPDATE REQUEST - Updating question with data:', updateData);
      
      await api.patch(`/questions/${creation.questionId}`, updateData);
      
      console.log('✅ DRAFT UPDATED - Question ID:', creation.questionId);
      return creation;
    }
  },

  // Save creation synchronously (for beforeunload events)
  saveDraftSync(creation: CreationData): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        content: creation.content, // Send as string, not parsed object
        isPublished: false
      });
      
      navigator.sendBeacon(
        `${API_URL}/api/questions/${creation.questionId}`,
        data
      );
      console.log('Creation service: Draft saved synchronously via beacon for ID:', creation.questionId);
    } else {
      console.warn('navigator.sendBeacon not available, draft not saved synchronously');
    }
  },

  // Submit final creation (publish)
  async submitCreation(creation: CreationData): Promise<CreationData> {
    // If we have a temporary ID, we need to create the question first
    if (creation.questionId.startsWith('temp-')) {
      console.log('Creating new question for submission with temporary ID:', creation.questionId);
      
      // Map question type to backend type ID
      const typeIdMap: Record<QuestionType, number> = {
        'cfg': 1,
        'decision-tree': 2,
        'cipher': 3
      };
      
      const response = await api.post('/questions', {
        questionTypeId: typeIdMap[creation.questionType],
        content: creation.content, // Send as string, not parsed object
        isPublished: true // Publish immediately
      });
      
      const newQuestion = response.data;
      
      // Return updated creation data with real ID
      const updatedCreation = {
        ...creation,
        questionId: newQuestion.id.toString(),
        isDraft: false,
        lastModified: new Date(newQuestion.createdAt)
      };
      
      console.log('Creation service: New question created and submitted with ID:', newQuestion.id);
      return updatedCreation;
    } else {
      // Update existing question to published
      await api.patch(`/questions/${creation.questionId}`, {
        content: creation.content, // Send as string, not parsed object
        isPublished: true // Publish the question
      });
      
      console.log('Creation service: Question submitted for ID:', creation.questionId);
      return { ...creation, isDraft: false };
    }
  },

  // Get latest draft for a creation
  async getLatestDraft(creationId: string): Promise<CreationData | null> {
    try {
      const response = await api.get(`/questions/${creationId}`);
      const question = response.data.props; // Extract from props wrapper
      
      // Only return if it's a draft
      if (question.isPublished) {
        return null;
      }
      
      return {
        questionId: question.id.toString(),
        creatorId: question.teacherId.toString(),
        title: question.title || `Question ${question.id}`,
        description: question.description || '',
        difficulty: 'Medium',
        category: 'General',
        points: 100,
        estimatedTime: 15,
        author: question.teacher?.name || 'Unknown',
        questionType: getQuestionTypeFromBackend(question.questionTypeId),
        content: typeof question.content === 'string' ? question.content : JSON.stringify(question.content),
        isDraft: !question.isPublished,
        lastModified: new Date(question.updatedAt)
      };
    } catch {
      return null;
    }
  },

  // Delete creation/draft
  async deleteCreation(id: string): Promise<void> {
    await api.delete(`/questions/${id}`);
    console.log(`Creation service: Deleted creation with ID: ${id}`);
  },

  // List user's creations
  async getUserCreations(creatorId: string): Promise<CreationInfo[]> {
    const response = await api.get(`/questions/user/${creatorId}`);
    const questions = response.data;
    
    return questions.map((question: { id: number; title?: string; description?: string; questionTypeId: number; teacher?: { name: string }; isPublished: boolean; updatedAt: string }) => ({
      id: question.id.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      type: getQuestionTypeFromBackend(question.questionTypeId),
      difficulty: 'Medium' as const,
      category: 'General',
      points: 100,
      estimatedTime: 15,
      author: question.teacher?.name || 'Unknown',
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    })).sort((a: CreationInfo, b: CreationInfo) => b.lastModified.getTime() - a.lastModified.getTime());
  }
}; 