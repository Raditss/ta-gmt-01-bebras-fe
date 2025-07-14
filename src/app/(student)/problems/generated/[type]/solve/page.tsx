'use client';

import { useParams } from 'next/navigation';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { solveGeneratedQuestionComponent } from '@/components/features/question';

export default function GeneratedSolvePage() {
  const params = useParams();
  const type = params?.type as QuestionTypeEnum;

  const Solver = solveGeneratedQuestionComponent[type];
  if (!Solver) {
    const DefaultSolver = solveGeneratedQuestionComponent[QuestionTypeEnum.CFG];
    return <DefaultSolver type={QuestionTypeEnum.CFG} />;
  }

  return <Solver type={type} />;
}
