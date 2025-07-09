"use client";

import {useParams} from "next/navigation";
import {QuestionTypeEnum} from "@/types/question-type.type";
import {Component, ReactNode, useEffect, useState} from "react";
import {Question} from "@/types/question.type";
import {creationService} from "@/lib/services/creation.service";
import {createQuestionComponent} from "@/components/features/question";

class CreatorErrorBoundary extends Component<
  { children: ReactNode; questionId: string; type: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: ReactNode;
    questionId: string;
    type: string;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen bg-yellow-400">
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Creation Error
              </h2>
              <p className="text-gray-700 mb-4">
                Failed to load question with ID: {this.props.questionId}
              </p>
              <p className="text-gray-600 mb-4">Type: {this.props.type}</p>
              <p className="text-sm text-gray-500 mb-4">
                Error: {this.state.error?.message}
              </p>
              <button
                onClick={() => (window.location.href = "/add-problem")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
              >
                Back to Add Problem
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function CreateQuestionPage() {
  const params = useParams();
  const type = params?.type as QuestionTypeEnum;
  const id = params?.id as string;
  const [question, setQuestion] = useState<Question | null>(null);

  const CreatorComponent = createQuestionComponent[type];

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const _question = await creationService.getCreateQuestionData(id);
        setQuestion(_question);
      } catch (error) {
        console.error("Failed to load question data:", error);
      }
    }
    loadQuestion()
  }, []);

  if (!CreatorComponent && !question) {
    return (
      <CreatorErrorBoundary questionId={id} type={type}>
        <div className="flex flex-col min-h-screen bg-yellow-400">
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                Not Implemented
              </h2>
              <p className="text-gray-700 mb-4">
                Question type &quot;{type}&quot; is not yet implemented.
              </p>
              <p className="text-gray-600 mb-4">
                Please check the available question types.
              </p>
              <button
                onClick={() => (window.location.href = "/add-problem")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
              >
                Back to Add Problem
              </button>
            </div>
          </div>
        </div>
      </CreatorErrorBoundary>
    );
  }

  return (
    <CreatorErrorBoundary questionId={id} type={type}>
      { question && <CreatorComponent initialDataQuestion={question}/>}
    </CreatorErrorBoundary>
  );
}
