import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import {
  ContagionProtocolAnswer,
  ContagionProtocolQuestion
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { QuestionAttemptData } from '@/types/question-attempt.type';
import { QuestionTypeEnum } from '@/types/question-type.type';

export class ContagionProtocolSolveModel extends IQuestion implements IAttempt {
  private _content: ContagionProtocolQuestion;
  private _answer: ContagionProtocolAnswer;
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.CONTAGION_PROTOCOL);

    this._content = {
      tree: {
        nodes: [],
        edges: []
      },
      monsters: []
    };

    this._answer = {
      monsters: [],
      currentId: ''
    };
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  get content() {
    return this._content;
  }

  get answer() {
    return this._answer;
  }

  getAttemptData(): QuestionAttemptData {
    return {
      questionId: this.id,
      duration: this.attemptDuration,
      isDraft: this.attemptIsDraft,
      answer: this.toJSON()
    };
  }

  loadAnswer(json: string): void {
    const answer = JSON.parse(json) as ContagionProtocolAnswer;
    if (!answer.monsters) {
      this._answer = {
        monsters: []
      };
    } else {
      this._answer = answer;
    }
  }

  populateQuestionFromString(questionString: string): void {
    try {
      const content = JSON.parse(questionString) as ContagionProtocolQuestion;
      if (content.monsters && content.tree) {
        this._content = content;
      } else {
        this._content = {
          monsters: [],
          tree: {
            nodes: [],
            edges: []
          }
        };
      }
      this.resetToInitialState();
    } catch (error) {
      console.error('Error parsing question data:', error);
      throw new Error('Invalid question data format');
    }
  }

  resetToInitialState(): void {
    this._answer = {
      monsters: []
    };
  }

  setAttemptData(duration: number, isDraft: boolean): void {
    this.attemptDuration = duration;
    this.attemptIsDraft = isDraft;
  }

  toJSON(): string {
    return JSON.stringify(this._answer);
  }
}
