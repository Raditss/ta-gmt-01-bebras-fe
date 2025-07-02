"use client";

import { useEffect, useState, ComponentType } from "react";
import { useParams } from "next/navigation";
import { questionService } from "@/services/questionService";
import { QuestionType } from "@/constants/questionTypes";
import dynamic from "next/dynamic";
import { MainNavbar } from "@/components/main-navbar";
import { BaseSolverProps } from "@/components/solvers/base-solver";
import DecisionTreeSolver from "@/components/solvers/decision-tree";

const solvers: Record<QuestionType, ComponentType<BaseSolverProps>> = {
  cfg: dynamic(() => import("@/components/solvers/cfg-solver")),
  "decision-tree": DecisionTreeSolver,
  cipher: dynamic(() => import("@/components/solvers/not-implemented")),
};

export default function SolvePage() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType | null>(null);

  useEffect(() => {
    const loadQuestionType = async () => {
      try {
        const info = await questionService.getQuestionInfo(id);
        setQuestionType(info.type);
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
