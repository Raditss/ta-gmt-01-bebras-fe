"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {questionService} from "@/lib/services/question.service";
import {getQuestionTypeByName, QuestionTypeEnum} from "@/types/question-type.type";
import {solveQuestionComponent} from "@/components/features/question";

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
      <div className="flex flex-col min-h-screen bg-grey-50">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !questionType) {
    return (
      <div className="flex flex-col min-h-screen bg-grey-50">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg text-red-600">
            {error || "Failed to load question"}
          </p>
        </div>
      </div>
    );
  }

  const Solver = solveQuestionComponent[questionType];
  if (!Solver) {
    return (
      <div className="flex flex-col min-h-screen bg-grey-50">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">This question type is not yet implemented.</p>
        </div>
      </div>
    );
  }

  return <Solver questionId={id} />;
}
