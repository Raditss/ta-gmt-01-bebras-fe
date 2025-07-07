"use client";

import { useParams } from "next/navigation";
import { QuestionTypeEnum } from "@/types/question-type.type";
import dynamic from "next/dynamic";
import { GeneratedSolverProps } from "@/components/features/bases/base.solver.generated";

// Dynamically import solver for different question types
const solvers: Record<
  QuestionTypeEnum,
  React.ComponentType<GeneratedSolverProps>
> = {
  // TODO: Add other solvers
  cfg: dynamic(
    () => import("@/components/features/question/cfg/cfg.solver.generated")
  ),
};

export default function GeneratedSolvePage() {
  const params = useParams();
  const type = params?.type as QuestionTypeEnum;

  const Solver = solvers[type];
  if (!Solver) {
    const DefaultSolver = solvers["cfg"];
    return <DefaultSolver type="cfg" />;
  }

  return <Solver type={type} />;
}
