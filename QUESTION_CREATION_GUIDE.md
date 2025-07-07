# Question Creation System - Developer Guide

## Overview

This system provides a flexible architecture for creating custom question types that can be easily integrated into the platform. The system uses an abstract `ICreateQuestion` interface that enables developers to encapsulate their question-specific content while the platform handles persistence, metadata, and lifecycle management.

## Architecture

### Frontend Architecture
- **ICreateQuestion Interface**: Abstract base class for all question types
- **CreationService**: Handles API communication and data persistence
- **useCreation Hook**: Manages creation state, auto-saving, and lifecycle
- **Content Encapsulation**: Question-specific data is serialized as JSON strings

### Backend Architecture
- **Content as JSON String**: Frontend sends encapsulated content as JSON strings
- **Metadata Storage**: Question metadata (title, description, difficulty, etc.) is stored separately
- **Draft Management**: Automatic draft saving and retrieval
- **Type-Agnostic Storage**: Backend doesn't need to understand question-specific content

## Creating Custom Question Types

### Step 1: Implement ICreateQuestion Interface

```typescript
// Example: Multiple Choice Question Implementation
export class MultipleChoiceQuestion extends ICreateQuestion {
  private questions: string[] = [];
  private options: string[][] = [];
  private correctAnswers: number[] = [];

  constructor(
    title: string = 'Untitled Multiple Choice',
    description: string = '',
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy',
    category: string = 'Multiple Choice',
    points: number = 100,
    estimatedTime: number = 15,
    author: string = ''
  ) {
    super(title, description, difficulty, category, points, estimatedTime, author);
  }

  // Required: Serialize content to JSON string
  contentToString(): string {
    return JSON.stringify({
      questions: this.questions,
      options: this.options,
      correctAnswers: this.correctAnswers,
      version: '1.0'
    });
  }

  // Required: Populate from JSON string
  populateFromContentString(contentString: string): void {
    try {
      const content = JSON.parse(contentString);
      this.questions = content.questions || [];
      this.options = content.options || [];
      this.correctAnswers = content.correctAnswers || [];
    } catch (error) {
      console.warn('Failed to parse multiple choice content:', error);
      // Initialize with empty state on parse error
      this.questions = [];
      this.options = [];
      this.correctAnswers = [];
    }
  }

  // Custom methods for this question type
  addQuestion(question: string, options: string[], correctAnswer: number): void {
    this.questions.push(question);
    this.options.push(options);
    this.correctAnswers.push(correctAnswer);
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
    this.options.splice(index, 1);
    this.correctAnswers.splice(index, 1);
  }

  getQuestions(): { question: string; options: string[]; correctAnswer: number }[] {
    return this.questions.map((question, index) => ({
      question,
      options: this.options[index] || [],
      correctAnswer: this.correctAnswers[index] || 0
    }));
  }
}
```

### Step 2: Create Question Factory

```typescript
// Factory function for creating question instances
export const createMultipleChoiceQuestion = (data: CreationData): ICreateQuestion => {
  const question = new MultipleChoiceQuestion(
    data.title,
    data.description,
    data.difficulty,
    data.category,
    data.points,
    data.estimatedTime,
    data.author
  );
  
  // Set IDs if available
  if (data.questionId) question.setId(data.questionId);
  if (data.creatorId) question.setCreatorId(data.creatorId);
  
  // Populate content if available
  if (data.content && data.content !== '{}') {
    question.populateFromContentString(data.content);
  }
  
  question.setIsDraft(data.isDraft);
  
  return question;
};
```

### Step 3: Use with Creation Hook

```typescript
// In your React component
const CreationPage = ({ questionId, questionType }: { questionId: string; questionType: QuestionType }) => {
  const {
    question,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged
  } = useCreation({
    questionId,
    questionType: 'multiple-choice' as QuestionType,
    initialData: {
      title: 'New Multiple Choice Question',
      description: 'Create a multiple choice question',
      difficulty: 'Medium',
      category: 'Multiple Choice',
      points: 100,
      estimatedTime: 15,
      author: 'Teacher Name'
    },
    createQuestionInstance: createMultipleChoiceQuestion
  });

  const multipleChoiceQuestion = question as MultipleChoiceQuestion;

  const handleAddQuestion = (questionText: string, options: string[], correct: number) => {
    if (multipleChoiceQuestion) {
      multipleChoiceQuestion.addQuestion(questionText, options, correct);
      markAsChanged(); // Important: Mark as changed for auto-save
    }
  };

  const handleSubmit = async () => {
    try {
      await submitCreation();
      // Navigate to success page
    } catch (error) {
      console.error('Failed to submit question:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{multipleChoiceQuestion?.getTitle() || 'Loading...'}</h1>
      
      {/* Your question creation UI here */}
      
      <div>
        <button onClick={saveDraft} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={handleSubmit} disabled={saving}>
          Submit Question
        </button>
      </div>
      
      {hasUnsavedChanges && (
        <div>You have unsaved changes</div>
      )}
    </div>
  );
};
```

## Key Features

### 1. Automatic Draft Saving
- Drafts are automatically saved when leaving the page
- `useCreation` hook handles all save logic
- Questions can be resumed from where you left off

### 2. Content Encapsulation
- Each question type manages its own content structure
- Content is serialized as JSON strings for storage
- Backend is type-agnostic and stores content as-is

### 3. Metadata Management
- Question metadata (title, difficulty, etc.) is handled separately
- Metadata is extracted and stored in the database for filtering/searching
- Content only contains question-specific data

### 4. ID Management
- New questions start with temporary IDs
- Real IDs are assigned by backend on first save
- Frontend automatically updates to use real IDs

### 5. Type Safety
- Full TypeScript support
- Strict typing for all question interfaces
- Runtime content validation

## Backend Storage

The backend stores questions with the following structure:

```json
{
  "id": 123,
  "content": "{\"questions\":[\"What is 2+2?\"],\"options\":[[\"3\",\"4\",\"5\"]],\"correctAnswers\":[1]}",
  "metadata": {
    "title": "Basic Math Quiz",
    "description": "Simple arithmetic questions",
    "difficulty": "Easy",
    "category": "Mathematics",
    "points": 50,
    "estimatedTime": 10,
    "author": "Prof. Smith"
  },
  "questionTypeId": 2,
  "teacherId": 456,
  "isPublished": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Error Handling

The system includes comprehensive error handling:

- **Content Parse Errors**: Invalid JSON gracefully handled with fallback to empty state
- **Network Errors**: Automatic retry with user feedback
- **Validation Errors**: Clear error messages for invalid data
- **Draft Recovery**: Automatic recovery of unsaved work

## Best Practices

1. **Always call markAsChanged()** when modifying question content
2. **Implement proper error handling** in content parsing
3. **Use meaningful version numbers** in your content structure
4. **Validate data** before serialization
5. **Provide fallback states** for corrupted content
6. **Keep content structure flat** for better performance

## Testing

Test your custom question types with:

```typescript
describe('MultipleChoiceQuestion', () => {
  it('should serialize and deserialize correctly', () => {
    const question = new MultipleChoiceQuestion();
    question.addQuestion('What is 2+2?', ['3', '4', '5'], 1);
    
    const serialized = question.contentToString();
    const newQuestion = new MultipleChoiceQuestion();
    newQuestion.populateFromContentString(serialized);
    
    expect(newQuestion.getQuestions()).toEqual(question.getQuestions());
  });
});
```

This architecture provides a robust, extensible system for creating custom question types while maintaining consistency and reliability across the platform. 