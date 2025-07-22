import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import { QuestionAttemptData } from '@/types/question-attempt.type';
import {
  AnomalyMonsterAnswer,
  AnomalyMonsterForm,
  AnomalyMonsterQuestion,
  Monster
} from '@/models/anomaly-monster/anomaly-monster.model.type';

export class AnomalyMonsterSolveModel extends IQuestion implements IAttempt {
  private _content: AnomalyMonsterQuestion;
  private answer: AnomalyMonsterAnswer;
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.ANOMALY_MONSTER);

    this._content = {
      tree: [],
      choices: []
    };

    this.answer = {
      anomaly: [],
      normal: [],
      forms: [],
      currentIdx: 0
    };
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  setAttemptData(duration: number, isDraft: boolean = true) {
    this.attemptDuration = duration;
    this.attemptIsDraft = isDraft;
  }

  get content() {
    return this._content;
  }

  get anomaly() {
    return this.answer.anomaly;
  }

  setAnomaly(anomaly: number[]) {
    this.answer.anomaly = anomaly;
  }

  get normal() {
    return this.answer.normal;
  }

  setNormal(normal: number[]) {
    this.answer.normal = normal;
  }

  get forms() {
    return this.answer.forms;
  }

  setForms(anomalyMonsterForms: AnomalyMonsterForm[]) {
    this.answer.forms = anomalyMonsterForms;
  }

  get currentIdx() {
    return this.answer.currentIdx;
  }

  setCurrentIdx(currentIdx: number) {
    this.answer.currentIdx = currentIdx;
  }

  getAttemptData(): QuestionAttemptData {
    return {
      questionId: this.id,
      duration: this.attemptDuration,
      isDraft: this.attemptIsDraft,
      answer: this.toJSON()
    };
  }

  toJSON(): string {
    return JSON.stringify(this.answer);
  }

  loadAnswer(json: string) {
    const answer = JSON.parse(json) as AnomalyMonsterAnswer;
    if (!answer.normal || !answer.anomaly || answer.currentIdx) {
      this.answer = {
        normal: [],
        anomaly: [],
        currentIdx: 0,
        forms: []
      };
    } else {
      this.answer = answer;
    }
  }

  populateQuestionFromString(questionString: string): void {
    try {
      this._content = JSON.parse(questionString) as AnomalyMonsterQuestion;
      this.resetToInitialState();
    } catch (error) {
      console.error('Error parsing question data:', error);
    }
  }

  resetToInitialState(): void {
    this.answer = {
      anomaly: [],
      normal: [],
      currentIdx: 0,
      forms: []
    };
  }

  getMonsterTree(): Monster[] {
    return this._content.tree || [];
  }

  setChosenMonster(monsterIds: number[]): void {
    this.answer.anomaly = monsterIds;
  }
}
