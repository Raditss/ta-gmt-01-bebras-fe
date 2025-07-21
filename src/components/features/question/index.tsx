import { QuestionTypeEnum } from '@/types/question-type.type';
import { ComponentType } from 'react';
import { BaseCreatorProps } from '@/components/features/bases/base.creator';
import AnomalyMonsterCreator from '@/components/features/question/anomaly-monster/creator/anomaly-monster.creator';
import CfgCreator from '@/components/features/question/cfg/cfg.creator';
import { BaseSolverProps } from '@/components/features/bases/base.solver';
import CfgSolver from '@/components/features/question/cfg/cfg.solver';
import CipherNSolver from '@/components/features/question/cipher-n/solver/cipher-n-solver';
import CipherNCreator from '@/components/features/question/cipher-n/cipher-n.creator';
import RingCipherSolver from '@/components/features/question/ring-cipher/solver/ring-cipher-solver';
import RingCipherCreator from '@/components/features/question/ring-cipher/ring-cipher.creator';

import DecisionTreeAnomalySolver from '@/components/features/question/anomaly-monster/anomaly-monster.solver';
import { GeneratedSolverProps } from '@/components/features/bases/base.solver.generated';
import GeneratedCfgSolver from '@/components/features/question/cfg/cfg.solver.generated';
import GeneratedCipherNSolver from '@/components/features/question/cipher-n/solver/cipher-n.solver.generated';
import GeneratedRingCipherSolver from '@/components/features/question/ring-cipher/solver/ring-cipher.solver.generated';
import GeneratedAnomalyMonsterSolver from '@/components/features/question/anomaly-monster/anomaly-monster.solver.generated';
import DecisionTreeTraceCreator from '@/components/features/question/decision-tree-trace/decision-tree-trace.creator';
import DecisionTreeTraceSolver from '@/components/features/question/decision-tree-trace/decision-tree-trace.solver';
import GeneratedDecisionTreeTraceSolver from '@/components/features/question/decision-tree-trace/decision-tree-trace.solver.generated';
import GeneratedContagionProtocolSolver from '@/components/features/question/contagion-protocol/contagion-protocol.solver.generated';
import ContagionProtocolCreator from '@/components/features/question/contagion-protocol/contagion-protocol.creator';
import ContagionProtocolSolver from '@/components/features/question/contagion-protocol/contagion-protocol.solver';
// import GeneratedNotImplementedSolver from '@/components/features/question/fallbacks/not-implemented.solver.generated';

export const createQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseCreatorProps>
> = {
  [QuestionTypeEnum.CFG]: CfgCreator,
  [QuestionTypeEnum.CIPHER_N]: CipherNCreator,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherCreator,
  [QuestionTypeEnum.ANOMALY_MONSTER]: AnomalyMonsterCreator,
  [QuestionTypeEnum.DECISION_TREE_TRACE]: DecisionTreeTraceCreator,
  [QuestionTypeEnum.CONTAGION_PROTOCOL]: ContagionProtocolCreator
};

export const solveQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseSolverProps>
> = {
  [QuestionTypeEnum.CFG]: CfgSolver,
  [QuestionTypeEnum.CIPHER_N]: CipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherSolver,
  [QuestionTypeEnum.ANOMALY_MONSTER]: DecisionTreeAnomalySolver,
  [QuestionTypeEnum.DECISION_TREE_TRACE]: DecisionTreeTraceSolver,
  [QuestionTypeEnum.CONTAGION_PROTOCOL]: ContagionProtocolSolver
};

export const solveGeneratedQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<GeneratedSolverProps>
> = {
  [QuestionTypeEnum.CFG]: GeneratedCfgSolver,
  [QuestionTypeEnum.CIPHER_N]: GeneratedCipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: GeneratedRingCipherSolver,
  [QuestionTypeEnum.ANOMALY_MONSTER]: GeneratedAnomalyMonsterSolver,
  [QuestionTypeEnum.DECISION_TREE_TRACE]: GeneratedDecisionTreeTraceSolver,
  [QuestionTypeEnum.CONTAGION_PROTOCOL]: GeneratedContagionProtocolSolver
};
