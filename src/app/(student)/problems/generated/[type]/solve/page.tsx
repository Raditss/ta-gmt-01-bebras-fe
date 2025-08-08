'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { solveGeneratedQuestionComponent } from '@/components/features/question';

export default function GeneratedSolvePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params?.type as QuestionTypeEnum;
  const difficulty = searchParams?.get('difficulty') || undefined;

  const Solver = solveGeneratedQuestionComponent[type];
  if (!Solver) {
    const DefaultSolver = solveGeneratedQuestionComponent[QuestionTypeEnum.CFG];
    return (
      <DefaultSolver type={QuestionTypeEnum.CFG} difficulty={difficulty} />
    );
  }

  return <Solver type={type} difficulty={difficulty} />;
}
