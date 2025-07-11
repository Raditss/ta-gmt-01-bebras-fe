import { QuestionTypeEnum } from '@/types/question-type.type';
import { ComponentType } from 'react';
import { BaseCreatorProps } from '@/components/features/bases/base.creator';
import Dt0Creator from '@/components/features/question/dt/dt-0/creator/dt-0.creator';
import Dt1Creator from '@/components/features/question/dt/dt-1/dt-1.creator';
import CfgCreator from '@/components/features/question/cfg/cfg.creator';
import { BaseSolverProps } from '@/components/features/bases/base.solver';
import CfgSolver from '@/components/features/question/cfg/cfg.solver';
import CipherNSolver from '@/components/features/question/cipher-n/solver/cipher-n-solver';
import CipherNCreator from '@/components/features/question/cipher-n/cipher-n.creator';
import RingCipherSolver from '@/components/features/question/ring-cipher/solver/ring-cipher-solver';
import RingCipherCreator from '@/components/features/question/ring-cipher/ring-cipher.creator';

import DecisionTreeSolver from '@/components/features/question/dt/dt-0/dt-0.solver';
import DecisionTree2Solver from '@/components/features/question/dt/dt-1/dt-1.solver';
import NotImplementedCreator from '@/components/features/question/fallbacks/not-implemented.creator';

export const createQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseCreatorProps>
> = {
  [QuestionTypeEnum.CFG]: CfgCreator,
  [QuestionTypeEnum.CIPHER_N]: CipherNCreator,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherCreator,
  [QuestionTypeEnum.DECISION_TREE]: Dt0Creator,
  [QuestionTypeEnum.DECISION_TREE_2]: Dt1Creator // TODO: change to CfgCreator when implemented,
};

export const solveQuestionComponent: Record<
  QuestionTypeEnum,
  ComponentType<BaseSolverProps>
> = {
  [QuestionTypeEnum.CFG]: CfgSolver,
  [QuestionTypeEnum.CIPHER_N]: CipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherSolver,
  [QuestionTypeEnum.DECISION_TREE]: DecisionTreeSolver,
  [QuestionTypeEnum.DECISION_TREE_2]: DecisionTree2Solver
};
