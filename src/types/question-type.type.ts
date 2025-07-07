
export enum QuestionTypeEnum {
  CFG = "context-free-grammar",
  CIPHER_N = "cipher-n",
  RING_CIPHER = "ring-cipher",
  DECISION_TREE = "decision-tree",
  DECISION_TREE_2 = "decision-tree-2",
}

export const getQuestionTypeByName = (questionTypeName: string): QuestionTypeEnum => {
  return Object.values(QuestionTypeEnum).includes(questionTypeName as QuestionTypeEnum)
    ? (questionTypeName as QuestionTypeEnum)
    : QuestionTypeEnum.CFG;
};
