import { QuestionType } from '@/constants/questionTypes';

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

// Unified storage for all creations (drafts and published)
// Use localStorage for persistence during development
const STORAGE_KEY = 'mockCreations';

const loadFromStorage = (): Record<string, CreationData> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert lastModified strings back to Date objects
      Object.values(parsed).forEach((creation: any) => {
        creation.lastModified = new Date(creation.lastModified);
      });
      console.log('Creation service: Loaded', Object.keys(parsed).length, 'creations from localStorage');
      return parsed;
    }
  } catch (error) {
    console.error('Creation service: Failed to load from localStorage:', error);
  }
  return {};
};

const saveToStorage = (creations: Record<string, CreationData>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creations));
    console.log('Creation service: Saved', Object.keys(creations).length, 'creations to localStorage');
  } catch (error) {
    console.error('Creation service: Failed to save to localStorage:', error);
  }
};

const mockCreations: Record<string, CreationData> = loadFromStorage();

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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const id = `creation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const creation: CreationData = {
      questionId: id,
      creatorId,
      ...initialData,
      questionType,
      content: '{}', // Empty content initially
      isDraft: true,
      lastModified: new Date()
    };
    
    mockCreations[id] = creation;
    saveToStorage(mockCreations);
    console.log('Creation service: Created new question with ID:', id);
    
    return creation;
  },

  // Fetch creation info by ID
  async getCreationInfo(id: string): Promise<CreationInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const creation = mockCreations[id];
    if (!creation) {
      console.error(`Creation service: Creation with ID ${id} not found`);
      throw new Error(`Creation with ID ${id} not found`);
    }
    
    return {
      id: creation.questionId,
      title: creation.title,
      description: creation.description,
      type: creation.questionType,
      difficulty: creation.difficulty,
      category: creation.category,
      points: creation.points,
      estimatedTime: creation.estimatedTime,
      author: creation.author,
      isDraft: creation.isDraft,
      lastModified: creation.lastModified
    };
  },

  // Fetch full creation data by ID
  async getCreationData(id: string): Promise<CreationData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const creation = mockCreations[id];
    if (!creation) {
      console.error(`Creation service: Creation with ID ${id} not found`);
      throw new Error(`Creation with ID ${id} not found`);
    }
    
    return creation;
  },

  // Save creation progress as draft
  async saveDraft(creation: CreationData): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Store/update in unified storage as draft
    const updatedCreation = {
      ...creation,
      isDraft: true,
      lastModified: new Date()
    };
    
    mockCreations[creation.questionId] = updatedCreation;
    saveToStorage(mockCreations);
    console.log('Creation service: Draft saved for ID:', creation.questionId);
  },

  // Save creation synchronously (for beforeunload events)
  saveDraftSync(creation: CreationData): void {
    // Store/update in unified storage as draft
    const updatedCreation = {
      ...creation,
      isDraft: true,
      lastModified: new Date()
    };
    
    mockCreations[creation.questionId] = updatedCreation;
    saveToStorage(mockCreations);
    console.log('Creation service: Draft saved synchronously for ID:', creation.questionId);
  },

  // Submit final creation (publish)
  async submitCreation(creation: CreationData): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Store/update in unified storage as published
    const publishedCreation = {
      ...creation,
      isDraft: false,
      lastModified: new Date()
    };
    
    mockCreations[creation.questionId] = publishedCreation;
    saveToStorage(mockCreations);
    
    console.log('Creation service: Question submitted for ID:', creation.questionId);
  },

  // Get latest draft for a creation
  async getLatestDraft(creationId: string): Promise<CreationData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const creation = mockCreations[creationId];
    return (creation && creation.isDraft) ? creation : null;
  },

  // Delete creation/draft
  async deleteCreation(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    delete mockCreations[id];
    saveToStorage(mockCreations);
    console.log(`Creation service: Deleted creation with ID: ${id}`);
  },

  // List user's creations
  async getUserCreations(creatorId: string): Promise<CreationInfo[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return Object.values(mockCreations)
      .filter(creation => creation.creatorId === creatorId)
      .map(creation => ({
        id: creation.questionId,
        title: creation.title,
        description: creation.description,
        type: creation.questionType,
        difficulty: creation.difficulty,
        category: creation.category,
        points: creation.points,
        estimatedTime: creation.estimatedTime,
        author: creation.author,
        isDraft: creation.isDraft,
        lastModified: creation.lastModified
      }))
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }
}; 