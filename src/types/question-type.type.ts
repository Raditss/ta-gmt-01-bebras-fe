export enum QuestionTypeEnum {
  CFG = 'context-free-grammar',
  CIPHER_N = 'cipher-n',
  RING_CIPHER = 'ring-cipher',
  DECISION_TREE_ANOMALY = 'decision-tree-anomaly',
  DECISION_TREE_TRACE = 'decision-tree-trace'
}

export const getQuestionTypeByName = (
  questionTypeName: string
): QuestionTypeEnum => {
  return Object.values(QuestionTypeEnum).includes(
    questionTypeName as QuestionTypeEnum
  )
    ? (questionTypeName as QuestionTypeEnum)
    : QuestionTypeEnum.CFG;
};
