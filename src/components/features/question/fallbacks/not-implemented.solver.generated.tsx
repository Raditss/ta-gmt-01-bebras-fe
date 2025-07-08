"use client";

import {
  GeneratedSolverProps,
  GeneratedSolverWrapper,
} from "@/components/features/bases/base.solver.generated";

export default function NotImplemented({ type }: GeneratedSolverProps) {

  return (
    <GeneratedSolverWrapper loading={false} error={null} type={type}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-lg">
          { type } generated questions
          are not yet implemented.
        </p>
      </div>
    </GeneratedSolverWrapper>
  );
}
