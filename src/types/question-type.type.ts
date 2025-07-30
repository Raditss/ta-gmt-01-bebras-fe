export enum QuestionTypeEnum {
  CFG = 'fish-trader',
  CIPHER_N = 'cipher-n',
  RING_CIPHER = 'ring-cipher',
  ANOMALY_MONSTER = 'anomaly-monster',
  DECISION_TREE_TRACE = 'decision-tree-trace',
  CONTAGION_PROTOCOL = 'contagion-protocol'
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
