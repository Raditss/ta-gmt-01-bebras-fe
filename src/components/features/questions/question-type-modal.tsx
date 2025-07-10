import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  QuestionTypeEnum,
  getQuestionTypeByName
} from '@/types/question-type.type';
import { questionTypeApi } from '@/lib/api/question-type.api';
import { QuestionTypeResponse } from '@/utils/validations/question-type.validation';

interface QuestionTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: QuestionTypeEnum) => void;
}

interface QuestionTypeOption {
  type: QuestionTypeEnum;
  title: string;
  description: string;
  color: string;
}

export function QuestionTypeModal({
  open,
  onClose,
  onSelectType
}: QuestionTypeModalProps) {
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const typesResponse = await questionTypeApi.getQuestionTypes();

      // Map to our display format with colors and better descriptions
      const typeOptions: QuestionTypeOption[] = typesResponse.map(
        (type: QuestionTypeResponse) => {
          const enumType = getQuestionTypeByName(type.props.name);
          return {
            type: enumType,
            title: formatTypeTitle(type.props.name),
            description: type.props.description,
            color: getTypeColor(enumType)
          };
        }
      );

      setQuestionTypes(typeOptions);
    } catch (error) {
      console.error('Error fetching question types:', error);
      setError('Failed to load question types');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch question types when modal opens
  useEffect(() => {
    if (open && questionTypes.length === 0) {
      fetchQuestionTypes();
    }
  }, [open, questionTypes.length, fetchQuestionTypes]);

  const formatTypeTitle = (name: string): string => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTypeColor = (type: QuestionTypeEnum): string => {
    const colors: Record<QuestionTypeEnum, string> = {
      [QuestionTypeEnum.CFG]:
        'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100',
      [QuestionTypeEnum.CIPHER_N]:
        'border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100',
      [QuestionTypeEnum.RING_CIPHER]:
        'border-pink-200 hover:border-pink-300 bg-pink-50 hover:bg-pink-100',
      [QuestionTypeEnum.DECISION_TREE]:
        'border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100',
      [QuestionTypeEnum.DECISION_TREE_2]:
        'border-yellow-200 hover:border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
    };
    return (
      colors[type] ||
      'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
    );
  };

  const handleSelectType = (type: QuestionTypeEnum) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Question Type</DialogTitle>
          <DialogDescription>
            Select the type of question you want to generate and solve
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <Button
                onClick={fetchQuestionTypes}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            questionTypes.map((qt) => (
              <Button
                key={qt.type}
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-start space-y-2 text-left border-2 transition-colors ${qt.color}`}
                onClick={() => handleSelectType(qt.type)}
              >
                <span className="font-semibold text-lg">{qt.title}</span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {qt.description}
                </span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
