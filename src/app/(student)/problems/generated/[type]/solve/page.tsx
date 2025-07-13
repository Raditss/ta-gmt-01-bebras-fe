'use client';

import { useParams } from 'next/navigation';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { GeneratedSolverProps } from '@/components/features/bases/base.solver.generated';
import GeneratedCfgSolver from '@/components/features/question/cfg/cfg.solver.generated';
import GeneratedCipherNSolver from '@/components/features/question/cipher-n/solver/cipher-n.solver.generated';
import GeneratedRingCipherSolver from '@/components/features/question/ring-cipher/solver/ring-cipher.solver.generated';
import GeneratedDt0Solver from '@/components/features/question/dt/dt-0/dt-0.solver.generated';
import GeneratedDt1Solver from '@/components/features/question/dt/dt-1/dt-1.solver.generated';
import { ComponentType } from 'react';

// Dynamically import solver for different question types
const solvers: Record<QuestionTypeEnum, ComponentType<GeneratedSolverProps>> = {
  [QuestionTypeEnum.CFG]: GeneratedCfgSolver,
  [QuestionTypeEnum.CIPHER_N]: GeneratedCipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: GeneratedRingCipherSolver,
  [QuestionTypeEnum.DECISION_TREE]: GeneratedDt0Solver,
  [QuestionTypeEnum.DECISION_TREE_2]: GeneratedDt1Solver
};

export default function GeneratedSolvePage() {
  const params = useParams();
  const type = params?.type as QuestionTypeEnum;

  const Solver = solvers[type];
  if (!Solver) {
    const DefaultSolver = solvers[QuestionTypeEnum.CFG];
    return <DefaultSolver type={QuestionTypeEnum.CFG} />;
  }

  return <Solver type={type} />;
}
