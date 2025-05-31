import { State, Rule, Step } from '@/model/cfg/create-question/model';

interface CfgQuestion {
  id: string;
  title: string;
  rules: Rule[];
  startState: State[];
  endState: State[];
  steps: Step[];
  isDraft: boolean;
  lastModified: Date;
}

// Mock database
const mockQuestions: Record<string, CfgQuestion> = {
  'mock-id-1': {
    id: 'mock-id-1',
    title: 'Example CFG Question',
    rules: [],
    startState: [],
    endState: [],
    steps: [],
    isDraft: false,
    lastModified: new Date()
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export async function fetchCfgQuestion(id: string) {
  await delay(1000); // Simulate network delay
  
  const question = mockQuestions[id];
  if (!question) {
    throw new Error('Question not found');
  }
  
  return question;
}

export async function createCfgQuestion(title: string, isDraft: boolean = true) {
  await delay(1000);
  
  const id = `mock-id-${Date.now()}`;
  const newQuestion: CfgQuestion = {
    id,
    title,
    rules: [],
    startState: [],
    endState: [],
    steps: [],
    isDraft,
    lastModified: new Date()
  };
  
  mockQuestions[id] = newQuestion;
  return newQuestion;
}

export async function updateCfgQuestion(id: string, updates: Partial<{
  title: string;
  rules: Rule[];
  startState: State[];
  endState: State[];
  steps: Step[];
  isDraft: boolean;
}>) {
  await delay(500);
  
  const question = mockQuestions[id];
  if (!question) {
    throw new Error('Question not found');
  }
  
  const updatedQuestion = {
    ...question,
    ...updates,
    lastModified: new Date()
  };
  
  mockQuestions[id] = updatedQuestion;
  return updatedQuestion;
}

export async function saveDraft(id: string, draftData: Partial<CfgQuestion>) {
  await delay(500);
  
  const question = mockQuestions[id];
  if (!question) {
    throw new Error('Question not found');
  }
  
  const updatedQuestion = {
    ...question,
    ...draftData,
    isDraft: true,
    lastModified: new Date()
  };
  
  mockQuestions[id] = updatedQuestion;
  return updatedQuestion;
}

export async function getDrafts() {
  await delay(500);
  
  return Object.values(mockQuestions)
    .filter(q => q.isDraft)
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export async function publishDraft(id: string) {
  await delay(500);
  
  const question = mockQuestions[id];
  if (!question) {
    throw new Error('Question not found');
  }
  
  if (!question.isDraft) {
    throw new Error('Question is not a draft');
  }
  
  const updatedQuestion = {
    ...question,
    isDraft: false,
    lastModified: new Date()
  };
  
  mockQuestions[id] = updatedQuestion;
  return updatedQuestion;
} 