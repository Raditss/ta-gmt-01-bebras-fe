import { ICreateQuestion } from '@/models/interfaces/create-question.model';
import {
  ContagionProtocolDecisionTree,
  ContagionProtocolQuestion,
  Monster
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { Question } from '@/types/question.type';

export class ContagionProtocolCreateModel extends ICreateQuestion {
  private _content: ContagionProtocolQuestion;

  constructor(draft: Question) {
    super(draft);
    this._content = {
      tree: {
        nodes: [],
        edges: []
      },
      monsters: []
    };
    this.populateFromContentString(this.draft.content);
  }

  get tree(): ContagionProtocolDecisionTree {
    return this._content.tree;
  }

  get monsters(): Monster[] {
    return this._content.monsters;
  }

  hasRequiredContent(): boolean {
    return (
      this._content.tree.nodes &&
      this._content.tree.nodes.length > 0 &&
      this._content.tree.edges &&
      this._content.tree.edges.length > 0 &&
      this._content.monsters &&
      this._content.monsters.length > 0
    );
  }

  populateFromContentString(contentString: string): void {
    try {
      if (!contentString || contentString === '{}') {
        this._content.tree = this._content.tree || { nodes: [], edges: [] };
        this._content.monsters = this._content.monsters || [];
      }
      const content = JSON.parse(contentString) as ContagionProtocolQuestion;

      this._content.tree = content.tree || { nodes: [], edges: [] };
      this._content.monsters = content.monsters || [];
    } catch (error) {
      console.error(
        'Error parsing Decision Tree Anomaly creation content:',
        error
      );

      this._content.tree = this._content.tree || { nodes: [], edges: [] };
      this._content.monsters = this._content.monsters || [];
    }
  }

  toJson(): string {
    return JSON.stringify(this._content);
  }

  validateContent(): boolean {
    return this.hasRequiredContent();
  }
}
