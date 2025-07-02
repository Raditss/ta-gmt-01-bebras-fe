import { AttemptData } from "@/model/interfaces/question";
import { QuestionType } from "@/constants/questionTypes";
import { Question } from "@/model/cfg/question/model";

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

// Mock data store - other developers can add their mock questions here
const mockQuestions: Record<
  string,
  { info: QuestionInfo; full: QuestionResponse }
> = {
  "1": {
    info: {
      id: "1",
      title: "Shape Transformation Challenge",
      description:
        "Transform a sequence of shapes into the target sequence using the provided transformation rules. This challenge tests your understanding of Context-Free Grammars and pattern manipulation.",
      type: "cfg",
      difficulty: "Hard",
      author: "System",
      estimatedTime: 15,
      points: 100,
    },
    full: {
      id: "1",
      title: "Shape Transformation Challenge",
      isGenerated: false,
      duration: 0,
      type: "cfg",
      content: JSON.stringify({
        startState: [
          { id: 1, type: "circle" },
          { id: 2, type: "triangle" },
          { id: 3, type: "square" },
          { id: 4, type: "triangle" },
          { id: 5, type: "triangle" },
          { id: 6, type: "circle" },
        ],
        endState: [
          { id: 1, type: "star" },
          { id: 2, type: "hexagon" },
          { id: 3, type: "star" },
        ],
        rules: [
          {
            id: "rule1",
            before: [
              { id: 1, type: "triangle" },
              { id: 2, type: "square" },
              { id: 3, type: "triangle" },
            ],
            after: [{ id: 1, type: "hexagon" }],
          },
          {
            id: "rule2",
            before: [
              { id: 1, type: "circle" },
              { id: 2, type: "triangle" },
            ],
            after: [{ id: 1, type: "star" }],
          },
          {
            id: "rule3",
            before: [
              { id: 2, type: "triangle" },
              { id: 1, type: "circle" },
            ],
            after: [{ id: 1, type: "star" }],
          },
        ],
        steps: [],
      }),
    },
  },
  "2": {
  info: {
    id: "2",
    title: "Octagon Cipher Challenge",
    description: "Encrypt messages using an 8-sided polygon with rotating arrows. Each letter is encoded using rotation and position numbers in a clockwise cipher system.",
    type: "cipher",
    difficulty: "Medium",
    author: "System",
    estimatedTime: 12,
    points: 120
  },
  full: {
    id: "2",
    title: "Octagon Cipher Challenge",
    isGenerated: true,
    duration: 0,
    type: "cipher",
    content: JSON.stringify({
      problemType: "polygon_cipher",
      config: {
        vertexCount: 8,
        polygonName: "octagon",
        startingVertex: 0,
        rotationDirection: "clockwise"
      },
      vertices: [
        { pos: 0, letters: "ABC" },
        { pos: 1, letters: "DEF" },
        { pos: 2, letters: "GHI" },
        { pos: 3, letters: "JKLY" },
        { pos: 4, letters: "MNOZ" },
        { pos: 5, letters: "PQR" },
        { pos: 6, letters: "STU" },
        { pos: 7, letters: "VWX" }
      ],
      instructions: [
        "An octagon has groups of letters at each vertex.",
        "An arrow points from center to a vertex and can rotate clockwise.",
        "At the start of encryption, the arrow always points to ABC.",
        "Each letter is encoded as two numbers:",
        "• First number: how many vertices to rotate the arrow",
        "• Second number: position of the letter in the target group"
      ],
      example: {
        plaintext: "TREE",
        encrypted: "62-73-42-02",
        explanation: "T→rotate 6 to STU, position 2 = 62; R→rotate 7 to PQR, position 3 = 73; etc."
      },
      question: {
        task: "encrypt",
        plaintext: "WATER",
        prompt: "What is the encrypted message for WATER?"
      },
      answer: {
        encrypted: "72-11-62-42-43",
        steps: [
          { letter: "W", from: 0, rotation: 7, to: 7, pos: 2, code: "72" },
          { letter: "A", from: 7, rotation: 1, to: 0, pos: 1, code: "11" },
          { letter: "T", from: 0, rotation: 6, to: 6, pos: 2, code: "62" },
          { letter: "E", from: 6, rotation: 4, to: 1, pos: 2, code: "42" },
          { letter: "R", from: 1, rotation: 4, to: 5, pos: 3, code: "43" }
        ]
      }
    })
  }
},
  "3": {
    info: {
      id: "3",
      title: "Monster Mischief",
      description:
        "Find the monster that is causing mischief in the forest using an interactive decision tree visualization.",
      type: "decision-tree",
      difficulty: "Medium",
      author: "System",
      estimatedTime: 15,
      points: 100,
    },
    full: {
      id: "3",
      title: "Monster Mischief",
      isGenerated: false,
      duration: 0,
      type: "decision-tree",
      content: JSON.stringify({
        rules: [
          {
            id: 1,
            conditions: [
              { attribute: "body", operator: "=", value: "A" },
              { attribute: "arms", operator: "=", value: "B" },
              { attribute: "legs", operator: "=", value: "C" },
              { attribute: "horns", operator: "=", value: "large" },
              { attribute: "color", operator: "=", value: "red" },
            ],
          },
          {
            id: 2,
            conditions: [
              { attribute: "body", operator: "=", value: "A" },
              { attribute: "arms", operator: "=", value: "C" },
              { attribute: "legs", operator: "=", value: "A" },
              { attribute: "horns", operator: "=", value: "large" },
              { attribute: "color", operator: "=", value: "green" },
            ],
          },
          {
            id: 3,
            conditions: [
              { attribute: "body", operator: "=", value: "D" },
              { attribute: "legs", operator: "=", value: "E" },
              { attribute: "horns", operator: "=", value: "small" },
              { attribute: "arms", operator: "=", value: "A" },
              { attribute: "color", operator: "=", value: "blue" },
            ],
          },
          {
            id: 4,
            conditions: [
              { attribute: "body", operator: "=", value: "F" },
              { attribute: "arms", operator: "=", value: "D" },
              { attribute: "legs", operator: "=", value: "B" },
              { attribute: "horns", operator: "=", value: "small" },
              { attribute: "color", operator: "=", value: "blue" },
            ],
          },
          {
            id: 5,
            conditions: [
              { attribute: "body", operator: "=", value: "B" },
              { attribute: "arms", operator: "=", value: "E" },
              { attribute: "legs", operator: "=", value: "D" },
              { attribute: "horns", operator: "=", value: "large" },
              { attribute: "color", operator: "=", value: "red" },
            ],
          },
          {
            id: 6,
            conditions: [
              { attribute: "body", operator: "=", value: "B" },
              { attribute: "arms", operator: "=", value: "B" },
              { attribute: "legs", operator: "=", value: "A" },
              { attribute: "horns", operator: "=", value: "none" },
              { attribute: "color", operator: "=", value: "green" },
            ],
          },
          {
            id: 7,
            conditions: [
              { attribute: "body", operator: "=", value: "A" },
              { attribute: "arms", operator: "=", value: "A" },
              { attribute: "legs", operator: "=", value: "C" },
              { attribute: "horns", operator: "=", value: "small" },
              { attribute: "color", operator: "=", value: "red" },
            ],
          },
          {
            id: 8,
            conditions: [
              { attribute: "body", operator: "=", value: "B" },
              { attribute: "arms", operator: "=", value: "C" },
              { attribute: "legs", operator: "=", value: "E" },
              { attribute: "horns", operator: "=", value: "none" },
              { attribute: "color", operator: "=", value: "blue" },
            ],
          },
        ],
      }),
    },
  },
  "4": {
    info: {
      id: "4",
      title: "The Great Escape",
      description:
        "The Great Escape is a game where you need to help the character to escape from the maze.",
      type: "decision-tree-2",
      difficulty: "Hard",
      author: "System",
      estimatedTime: 15,
      points: 100,
    },
    full: {
      id: "4",
      title: "The Great Escape",
      isGenerated: false,
      duration: 0,
      type: "decision-tree-2",
      content: JSON.stringify({
        finishes: [
          { id: 1, name: "A" },
          { id: 2, name: "B" },
          { id: 3, name: "C" },
        ],
        goals: [1, 2],
        rules: [
          {
            id: 1,
            conditions: [
              { attribute: "body", operator: "=", value: "A" },
              { attribute: "arms", operator: "=", value: "B" },
              { attribute: "legs", operator: "=", value: "C" },
              { attribute: "horns", operator: "=", value: "large" },
              { attribute: "color", operator: "=", value: "red" },
            ],
            finish: 1,
          },
          {
            id: 2,
            conditions: [
              { attribute: "body", operator: "=", value: "A" },
              { attribute: "arms", operator: "=", value: "C" },
              { attribute: "legs", operator: "=", value: "A" },
              { attribute: "horns", operator: "=", value: "large" },
              { attribute: "color", operator: "=", value: "green" },
            ],
            finish: 2,
          },
          {
            id: 3,
            conditions: [
              { attribute: "body", operator: "=", value: "D" },
              { attribute: "legs", operator: "=", value: "E" },
              { attribute: "horns", operator: "=", value: "small" },
              { attribute: "arms", operator: "=", value: "A" },
              { attribute: "color", operator: "=", value: "blue" },
            ],
            finish: 3,
          },
          // {
          //   id: 4,
          //   conditions: [
          //     { attribute: "body", operator: "=", value: "E" },
          //     { attribute: "legs", operator: "=", value: "E" },
          //     { attribute: "horns", operator: "=", value: "small" },
          //     { attribute: "arms", operator: "=", value: "A" },
          //     { attribute: "color", operator: "=", value: "dark" },
          //   ],
          //   finish: 1,
          // },
        ],
      }),
    },
  },
};

const mockAttempts: {
  drafts: Record<string, AttemptData>;
  completed: Record<string, AttemptData[]>;
} = {
  drafts: {},
  completed: {},
};

export const questionService = {
  // Fetch question information by ID (without solve data)
  async getQuestionInfo(id: string): Promise<QuestionInfo> {
    // const response = await api.get<QuestionInfo>(`/questions/${id}/info`);
    // return response.data;

    // Return mock data
    const mockQuestion = mockQuestions[id];
    if (!mockQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return mockQuestion.info;
  },

  // Fetch full question data by ID (for solving)
  async getQuestionById(id: string): Promise<QuestionResponse> {
    // const response = await api.get<QuestionResponse>(`/questions/${id}`);
    // return response.data;

    // Return mock data
    const mockQuestion = mockQuestions[id];
    if (!mockQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return mockQuestion.full;
  },

  // Generate a random question
  async generateQuestion(type: QuestionType): Promise<QuestionResponse> {
    // const response = await api.post<QuestionResponse>(`/questions/generate`, { type });
    // return response.data;

    // For now, return the first mock question but mark it as generated
    const mockQuestion = mockQuestions["1"];
    if (!mockQuestion) {
      throw new Error("No mock questions available");
    }
    return {
      ...mockQuestion.full,
      id: `${type}-${Math.random().toString(36).substr(2, 6)}`,
      isGenerated: true,
      type,
    };
  },

  // Save attempt progress
  async saveDraft(attempt: AttemptData): Promise<void> {
    // Store in mock drafts - only keep the latest draft
    mockAttempts.drafts[attempt.questionId] = attempt;
    console.log("Draft saved:", attempt);
  },

  // Save attempt synchronously (for beforeunload events)
  saveDraftSync(attempt: AttemptData): void {
    // Store in mock drafts - only keep the latest draft
    mockAttempts.drafts[attempt.questionId] = attempt;
    console.log("Draft saved (sync):", attempt);
  },

  // Submit final attempt
  async submitAttempt(attempt: AttemptData): Promise<void> {
    // Store in completed attempts
    if (!mockAttempts.completed[attempt.questionId]) {
      mockAttempts.completed[attempt.questionId] = [];
    }
    mockAttempts.completed[attempt.questionId].push(attempt);

    // Clear draft for this question
    delete mockAttempts.drafts[attempt.questionId];

    console.log("Attempt submitted:", attempt);
    console.log("Current mock state:", {
      drafts: mockAttempts.drafts,
      completed: mockAttempts.completed,
    });
  },

  // Get attempt history for a question
  async getAttemptHistory(
    questionId: string,
    userId: string
  ): Promise<AttemptData[]> {
    // Return completed attempts
    console.log(userId);
    return mockAttempts.completed[questionId] || [];
  },

  // Get latest attempt for a question
  async getLatestAttempt(
    questionId: string,
    userId: string
  ): Promise<AttemptData | null> {
    // Only return draft attempt if it exists
    console.log(userId);
    return mockAttempts.drafts[questionId] || null;
  },

  // Check answer for generated questions
  async checkGeneratedAnswer(
    data: GeneratedAnswerCheck
  ): Promise<CheckResponse> {
    try {
      // Get the question data
      const questionData = mockQuestions["1"]; // Using mock question for now
      if (!questionData) {
        throw new Error("Question not found");
      }

      // Create a Question instance to check the answer
      const question = new Question(
        questionData.full.id,
        questionData.full.title,
        questionData.full.type,
        true,
        questionData.full.duration
      );

      // Load the question content
      question.populateQuestionFromString(questionData.full.content);

      // Load the user's solution
      const solutionData = JSON.parse(data.solution);
      question.loadSolution(JSON.stringify(solutionData));

      // Use the Question class's checkAnswer method
      const isCorrect = question.checkAnswer();

      // Calculate points based on correctness and time
      const points = isCorrect
        ? Math.max(100 - Math.floor(data.duration / 10), 10)
        : 0;

      // For now, use a simple streak system
      const streak = isCorrect ? 1 : 0;

      const response = {
        isCorrect,
        points,
        streak,
      };

      console.log("Generated question answer check:", {
        ...data,
        ...response,
      });

      return response;
    } catch (err) {
      console.error("Error checking answer:", err);
      throw new Error("Failed to check answer");
    }
  },
};
