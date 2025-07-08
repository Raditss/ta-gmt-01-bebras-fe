"use client";

import { useEffect, useState, ComponentType } from "react";
import { useParams } from "next/navigation";
import { questionService } from "@/lib/services/question.service";
import {getQuestionTypeByName, QuestionTypeEnum} from "@/types/question-type.type";
import { MainNavbar } from "@/components/layout/Nav/main-navbar";
import { BaseSolverProps } from "@/components/features/bases/base.solver";
import DecisionTreeSolver from "@/components/features/question/dt-0/solver";
import CfgSolver from "@/components/features/question/cfg/cfg.solver";
import RingCipherSolver from "@/components/features/question/ring-cipher/solver/ring-cipher-solver";
import CipherNSolver from "@/components/features/question/cipher-n/solver/cipher-n-solver";
import DecisionTree2Solver from "@/components/features/question/dt-1/dt-1.solver";

const solvers: Record<QuestionTypeEnum, ComponentType<BaseSolverProps>> = {
  [QuestionTypeEnum.CFG]: CfgSolver,
  [QuestionTypeEnum.CIPHER_N]: CipherNSolver,
  [QuestionTypeEnum.RING_CIPHER]: RingCipherSolver,
  [QuestionTypeEnum.DECISION_TREE] : DecisionTreeSolver,
  [QuestionTypeEnum.DECISION_TREE_2]: DecisionTree2Solver,
};

export default function SolvePage() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<QuestionTypeEnum | null>(null);

  useEffect(() => {
    const loadQuestionType = async () => {
      try {
        const question = await questionService.getQuestionById(id);
        console.log("Loaded question:", question);
        setQuestionType(getQuestionTypeByName(question.questionType.name));
      } catch (err) {
        console.error(err);
        setError("Failed to load question information");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionType();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !questionType) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg text-red-600">
            {error || "Failed to load question"}
          </p>
        </div>
      </div>
    );
  }

  const Solver = solvers[questionType];
  if (!Solver) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">This question type is not yet implemented.</p>
        </div>
      </div>
    );
  }

  return <Solver questionId={id} />;
}
