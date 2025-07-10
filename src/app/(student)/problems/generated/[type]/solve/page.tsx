"use client";

import { useParams } from "next/navigation";
import { QuestionTypeEnum } from "@/types/question-type.type";
import { GeneratedSolverProps } from "@/components/features/bases/base.solver.generated";
import GeneratedCfgSolver from "@/components/features/question/cfg/cfg.solver.generated";
import GeneratedCipherNSolver from "@/components/features/question/cipher-n/solver/cipher-n.solver.generated";
import GeneratedRingCipherSolver from "@/components/features/question/ring-cipher/solver/ring-cipher.solver.generated";
import {ComponentType} from "react";
import NotImplemented from "@/components/features/question/fallbacks/not-implemented.solver.generated";

// Dynamically import solver for different question types
const solvers: Record<
  QuestionTypeEnum,
  ComponentType<GeneratedSolverProps>
> = {
  [QuestionTypeEnum.CFG]: GeneratedCfgSolver,
  [QuestionTypeEnum.CIPHER_N]: GeneratedCipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: GeneratedRingCipherSolver,
  [QuestionTypeEnum.DECISION_TREE] : NotImplemented,
  [QuestionTypeEnum.DECISION_TREE_2]: NotImplemented,
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
