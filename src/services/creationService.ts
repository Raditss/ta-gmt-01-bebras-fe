import { QuestionType } from '@/constants/questionTypes';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance with authentication
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  // BLOCK any API calls that contain "/new" in the questions endpoint
  if (config.url?.includes('/questions/new') || config.url?.includes('questions/new')) {
    throw new Error('BLOCKED: API call to /questions/new is not allowed. Use local creation instead.');
  }
  
  // Also check for literal "new" as question ID
  if (config.url?.match(/\/questions\/new(\/|$|\?)/)) {
    throw new Error('BLOCKED: API call with "new" as question ID is not allowed.');
  }
  
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
    4: 'cfg', // fallback
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
      'cipher': 3,
      'decision-tree-2': 0
    };
    
    const response = await api.post('/questions', {
      questionTypeId: typeIdMap[questionType],
      content: '{}', // Empty content initially as string
      isPublished: false, // Start as draft
      // Include metadata fields
      title: initialData.title,
      description: initialData.description,
      difficulty: initialData.difficulty,
      category: initialData.category,
      points: initialData.points,
      estimatedTime: initialData.estimatedTime,
      author: initialData.author
    });
    

    
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
    // Safeguard: Never call backend for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      throw new Error('Cannot fetch creation info for new or temporary questions. Use local creation instead.');
    }
    
    const response = await api.get(`/questions/${id}/info`);
    const question = response.data; // This endpoint returns direct format
    
    return {
      id: question.id.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      type: getQuestionTypeFromBackend(question.questionTypeId),
      difficulty: (question.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
      category: question.category || 'General',
      points: question.points || 100,
      estimatedTime: question.estimatedTime || 15,
      author: question.author || question.teacher?.name || 'Unknown',
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    };
  },

  // Fetch full creation data by ID
  async getCreationData(id: string): Promise<CreationData> {
    // Safeguard: Never call backend for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      throw new Error('Cannot fetch creation data for new or temporary questions. Use local creation instead.');
    }
    
    const response = await api.get(`/questions/${id}`);
    const question = response.data.props; // Extract from props wrapper
    
    // Check if question is already published/submitted
    if (question.isPublished) {
      throw new Error('QUESTION_ALREADY_SUBMITTED');
    }
    
    const processedContent = typeof question.content === 'string' ? question.content : JSON.stringify(question.content);
    
    const creationData = {
      questionId: question.id.toString(),
      creatorId: question.teacherId.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      difficulty: (question.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
      category: question.category || 'General',
      points: question.points || 100,
      estimatedTime: question.estimatedTime || 15,
      author: question.author || question.teacher?.name || 'Unknown',
      questionType: getQuestionTypeFromBackend(question.questionTypeId),
      content: processedContent,
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    };
    
    return creationData;
  },

  // Save creation progress as draft
  async saveDraft(creation: CreationData): Promise<CreationData> {
    // If we have a temporary ID, we need to create the question first
    if (creation.questionId.startsWith('temp-')) {
      // Map question type to backend type ID
      const typeIdMap: Record<QuestionType, number> = {
        'cfg': 1,
        'decision-tree': 2,
        'cipher': 3,
        'decision-tree-2': 0
      };
      
      // TEMPORARY: Send only required fields to test basic functionality
      const requestData = {
        questionTypeId: typeIdMap[creation.questionType],
        content: creation.content,
        isPublished: false
      };
      
      // TODO: Add optional metadata fields once validation is working
      // if (creation.title) requestData.title = creation.title;
      
              console.log('🚀 FRONTEND - Creating new question with data:', {
          url: '/questions',
          method: 'POST',
          questionTypeId: requestData.questionTypeId,
          isPublished: requestData.isPublished,
          contentLength: requestData.content?.length || 0,
          allFields: Object.keys(requestData),
          fullData: requestData
        });
      
      const response = await api.post('/questions', requestData);
      let newQuestion = response.data;
      
      console.log('🔍 DEBUGGING - Full response:', response);
      console.log('🔍 DEBUGGING - Response data:', newQuestion);
      
      // Handle both wrapped and unwrapped response formats
      if (newQuestion.props) {
        console.log('🔍 DEBUGGING - Found props wrapper, unwrapping...');
        newQuestion = newQuestion.props;
      }
      
      console.log('🔍 DEBUGGING - Final question data:', newQuestion);
      console.log('🔍 DEBUGGING - Question ID type:', typeof newQuestion.id);
      console.log('🔍 DEBUGGING - Question ID value:', newQuestion.id);
      
      if (!newQuestion.id) {
        console.error('❌ ERROR - No ID received from backend:', newQuestion);
        throw new Error('Failed to get question ID from backend response');
      }
      
      // Log the created question ID for easy access
      console.log('📝 QUESTION CREATED - ID:', newQuestion.id);
      console.log('🔗 Direct URL: http://localhost:3100/add-problem/create/cfg/' + newQuestion.id);
      
      // Return updated creation data with real ID
      const updatedCreation = {
        ...creation,
        questionId: newQuestion.id.toString(),
        lastModified: new Date(newQuestion.createdAt || new Date())
      };
      
      return updatedCreation;
    } else {
      // Update existing question - include all metadata fields
      const updateData = {
        content: creation.content,
        isPublished: false,
        // Include metadata fields
        title: creation.title,
        description: creation.description,
        difficulty: creation.difficulty,
        category: creation.category,
        points: creation.points,
        estimatedTime: creation.estimatedTime,
        author: creation.author
      };
      
      console.log('🚀 FRONTEND - Updating existing question:', {
        url: `/questions/${creation.questionId}`,
        method: 'PATCH',
        questionId: creation.questionId,
        contentLength: updateData.content?.length || 0,
        allFields: Object.keys(updateData),
        fullData: updateData
      });
      
      await api.patch(`/questions/${creation.questionId}`, updateData);
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
      // Map question type to backend type ID
      const typeIdMap: Record<QuestionType, number> = {
        'cfg': 1,
        'decision-tree': 2,
        'cipher': 3,
        'decision-tree-2': 0
      };
      
      // Include all metadata fields for new question creation
      const requestData = {
        questionTypeId: typeIdMap[creation.questionType],
        content: creation.content,
        isPublished: true,
        // Include metadata fields
        title: creation.title,
        description: creation.description,
        difficulty: creation.difficulty,
        category: creation.category,
        points: creation.points,
        estimatedTime: creation.estimatedTime,
        author: creation.author
      };
      
      const response = await api.post('/questions', requestData);
      let newQuestion = response.data;
      
      // Handle both wrapped and unwrapped response formats
      if (newQuestion.props) {
        newQuestion = newQuestion.props;
      }
      
      // Log the submitted question ID for easy access
      console.log('📝 QUESTION SUBMITTED - ID:', newQuestion.id);
      console.log('🔗 Direct URL: http://localhost:3100/add-problem/create/cfg/' + newQuestion.id);
      
      // Return updated creation data with real ID
      const updatedCreation = {
        ...creation,
        questionId: newQuestion.id.toString(),
        isDraft: false,
        lastModified: new Date(newQuestion.createdAt)
      };
      
      return updatedCreation;
    } else {
      // Update existing question to published - include all metadata fields
      const updateData = {
        content: creation.content,
        isPublished: true,
        // Include metadata fields
        title: creation.title,
        description: creation.description,
        difficulty: creation.difficulty,
        category: creation.category,
        points: creation.points,
        estimatedTime: creation.estimatedTime,
        author: creation.author
      };
      
      console.log('🚀 FRONTEND - Submitting existing question:', {
        url: `/questions/${creation.questionId}`,
        method: 'PATCH',
        questionId: creation.questionId,
        contentLength: updateData.content?.length || 0,
        allFields: Object.keys(updateData),
        fullData: updateData
      });
      
      await api.patch(`/questions/${creation.questionId}`, updateData);
      
      console.log('📝 QUESTION SUBMITTED - ID:', creation.questionId);
      return { ...creation, isDraft: false };
    }
  },

  // Get latest draft for a creation
  async getLatestDraft(creationId: string): Promise<CreationData | null> {
    // Safeguard: Never call backend for "new" questions
    if (creationId === 'new' || creationId.startsWith('temp-')) {
      return null; // No draft exists for new questions
    }
    
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
        difficulty: (question.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
        category: question.category || 'General',
        points: question.points || 100,
        estimatedTime: question.estimatedTime || 15,
        author: question.author || question.teacher?.name || 'Unknown',
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
    // Safeguard: Never call backend for "new" questions
    if (id === 'new' || id.startsWith('temp-')) {
      return;
    }
    
    await api.delete(`/questions/${id}`);
  },

  // List user's creations
  async getUserCreations(creatorId: string): Promise<CreationInfo[]> {
    const response = await api.get(`/questions/user/${creatorId}`);
    const questions = response.data;
    
    return questions.map((question: { 
      id: number; 
      title?: string; 
      description?: string; 
      difficulty?: string;
      category?: string;
      points?: number;
      estimatedTime?: number;
      author?: string;
      questionTypeId: number; 
      teacher?: { name: string }; 
      isPublished: boolean; 
      updatedAt: string 
    }) => ({
      id: question.id.toString(),
      title: question.title || `Question ${question.id}`,
      description: question.description || '',
      type: getQuestionTypeFromBackend(question.questionTypeId),
      difficulty: (question.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
      category: question.category || 'General',
      points: question.points || 100,
      estimatedTime: question.estimatedTime || 15,
      author: question.author || question.teacher?.name || 'Unknown',
      isDraft: !question.isPublished,
      lastModified: new Date(question.updatedAt)
    })).sort((a: CreationInfo, b: CreationInfo) => b.lastModified.getTime() - a.lastModified.getTime());
  }
}; 