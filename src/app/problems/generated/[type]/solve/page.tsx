"use client"

import { useParams } from 'next/navigation';
import { QuestionType } from '@/constants/questionTypes';
import dynamic from 'next/dynamic';
import { GeneratedSolverProps } from '@/components/solvers/generated/base-solver';

// Dynamically import solvers for different question types
const solvers: Record<QuestionType, React.ComponentType<GeneratedSolverProps>> = {
  'cfg': dynamic(() => import('@/components/solvers/generated/cfg-solver')),
  'decision-tree': dynamic(() => import('@/components/solvers/generated/not-implemented')),
  'cipher': dynamic(() => import('@/components/solvers/generated/not-implemented'))
};

export default function GeneratedSolvePage() {
  const params = useParams();
  const type = params?.type as QuestionType;

  const Solver = solvers[type];
  if (!Solver) {
    const DefaultSolver = solvers['cfg'];
    return <DefaultSolver type="cfg" />;
  }

  return <Solver type={type} />;
} 