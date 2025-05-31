import { IQuestion, IAttempt } from "@/types/question";
import { QuestionSetup } from "@/model/interfaces/question";
import { State } from "@/model/cfg/create-question/model";
import { QuestionType } from "@/constants/questionTypes";

// Mock data for development - this represents the API response format
interface QuestionResponse {
  id: string;
  title: string;
  isGenerated: boolean;
  duration: number;
  type: QuestionType;
  content: QuestionSetup; // The actual question setup data
}

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

const mockQuestionInfo: QuestionInfo = {
  id: "1",
  title: "Shape Transformation Challenge",
  description: "Transform a sequence of shapes into the target sequence using the provided transformation rules. This challenge tests your understanding of Context-Free Grammars and pattern manipulation.",
  type: 'cfg',
  difficulty: 'Medium',
  author: 'System',
  estimatedTime: 15,
  points: 100
};

const mockQuestionSetup: QuestionSetup = {
  startState: [
    { id: 1, type: 'circle' },
    { id: 2, type: 'triangle' },
    { id: 3, type: 'square' },
    { id: 4, type: 'triangle' },
    { id: 5, type: 'triangle' },
    { id: 6, type: 'circle' },
  ],
  endState: [
    { id: 1, type: 'star' },
    { id: 2, type: 'hexagon' },
    { id: 3, type: 'star' },
  ],
  rules: [
    {
      id: 'rule1',
      before: [
        { id: 1, type: 'triangle' },
        { id: 2, type: 'square' },
        { id: 3, type: 'triangle' }
      ],
      after: [{ id: 1, type: 'hexagon' }]
    },
    {
      id: 'rule2',
      before: [
        { id: 1, type: 'circle' },
        { id: 2, type: 'triangle' }
      ],
      after: [{ id: 1, type: 'star' }]
    },
    {
      id: 'rule3',
      before: [
        { id: 2, type: 'triangle' },
        { id: 1, type: 'circle' }
      ],
      after: [{ id: 1, type: 'star' }]
    }
  ],
  steps: []
};

const mockQuestion: QuestionResponse = {
  id: "1",
  title: "Shape Transformation Challenge",
  isGenerated: false,
  duration: 0,
  type: 'cfg',
  content: mockQuestionSetup
};

export const questionService = {
  // Fetch question information by ID (without solve data)
  async getQuestionInfo(id: string): Promise<QuestionInfo> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockQuestionInfo, id };
  },

  // Fetch full question data by ID (for solving)
  async getQuestionById(id: string): Promise<QuestionResponse> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // If it's a generated question ID (contains the type prefix)
    if (id.includes('-')) {
      const [type, _] = id.split('-');
      return {
        ...mockQuestion,
        id,
        title: `Generated: Problem #${Math.floor(Math.random() * 1000)}`,
        isGenerated: true,
        type: type as QuestionType
      };
    }
    
    return { ...mockQuestion, id };
  },

  // Generate a random question
  async generateQuestion(type: QuestionType): Promise<QuestionResponse> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generatedId = `${type}-${Math.random().toString().slice(2, 8)}`;
    return { 
      ...mockQuestion,
      id: generatedId,
      title: `Generated: Problem #${Math.floor(Math.random() * 1000)}`,
      isGenerated: true,
      type
    };
  },

  // Save attempt progress
  async saveAttempt(attempt: IAttempt): Promise<void> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Attempt saved:', attempt);
  }
}; 