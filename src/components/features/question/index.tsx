import { QuestionTypeEnum } from '@/types/question-type.type';
import { ComponentType } from 'react';
import { BaseCreatorProps } from '@/components/features/bases/base.creator';
import Dt0Creator from '@/components/features/question/dt/dt-0/dt-0.creator';
import Dt1Creator from '@/components/features/question/dt-1/dt-1.creator';
import { BaseSolverProps } from '@/components/features/bases/base.solver';
import CfgSolver from '@/components/features/question/cfg/cfg.solver';
import CipherNSolver from '@/components/features/question/cipher-n/solver/cipher-n-solver';
import RingCipherSolver from '@/components/features/question/ring-cipher/solver/ring-cipher-solver';
import DecisionTreeSolver from '@/components/features/question/dt/dt-0/solver';
import DecisionTree2Solver from '@/components/features/question/dt-1/dt-1.solver';
import NotImplementedCreator from '@/components/features/question/fallbacks/not-implemented.creator';
import NotImplementedSolver from '@/components/features/question/fallbacks/not-implemented.solver';

export const createQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseCreatorProps>
> = {
  [QuestionTypeEnum.CFG]: NotImplementedCreator, // TODO: change to CfgCreator when implemented
  [QuestionTypeEnum.CIPHER_N]: NotImplementedCreator, // TODO: change to CfgCreator when implemented
  [QuestionTypeEnum.RING_CIPHER]: NotImplementedCreator, // TODO: change to CfgCreator when implemented,
  [QuestionTypeEnum.DECISION_TREE]: NotImplementedCreator,
  [QuestionTypeEnum.DECISION_TREE_2]: NotImplementedCreator // TODO: change to CfgCreator when implemented,
};

export const solveQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseSolverProps>
> = {
  [QuestionTypeEnum.CFG]: CfgSolver,
  [QuestionTypeEnum.CIPHER_N]: CipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherSolver,
  [QuestionTypeEnum.DECISION_TREE]: NotImplementedSolver,
  [QuestionTypeEnum.DECISION_TREE_2]: NotImplementedSolver
};
