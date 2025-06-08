"use client"

import { GeneratedSolverProps, GeneratedSolverWrapper } from './base-solver';
import { QUESTION_TYPES } from '@/constants/questionTypes';

export default function NotImplemented({ type }: GeneratedSolverProps) {
  const questionTypeInfo = QUESTION_TYPES.find(qt => qt.type === type);
  
  return (
    <GeneratedSolverWrapper loading={false} error={null} type={type}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-lg">{questionTypeInfo?.title || type.toUpperCase()} generated questions are not yet implemented.</p>
      </div>
    </GeneratedSolverWrapper>
  );
} 