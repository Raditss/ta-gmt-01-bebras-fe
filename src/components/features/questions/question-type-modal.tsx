import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getQuestionTypeByName,
  QuestionTypeEnum
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
      setError('Gagal memuat jenis soal');
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
    // Special case for fish-trader
    switch (name) {
      case QuestionTypeEnum.CFG:
        return 'Pedagang Ikan';
      case QuestionTypeEnum.ANOMALY_MONSTER:
        return 'Monster yang Aneh';
    }
    if (name === 'fish-trader') {
      return 'Pedagang Ikan';
    }
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
      [QuestionTypeEnum.ANOMALY_MONSTER]:
        'border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100',
      [QuestionTypeEnum.DECISION_TREE_TRACE]:
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
      <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Pilih Jenis Soal
          </DialogTitle>
          <DialogDescription className="text-base">
            Pilih jenis soal yang ingin Anda buat dan selesaikan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p className="mb-4">{error}</p>
              <Button
                onClick={fetchQuestionTypes}
                variant="outline"
                className="mt-4"
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            questionTypes.map((qt) => (
              <Button
                key={qt.type}
                variant="outline"
                className={`w-full h-auto p-6 flex flex-col items-start space-y-3 text-left border-2 transition-colors ${qt.color}`}
                onClick={() => handleSelectType(qt.type)}
              >
                <span className="font-semibold text-lg w-full">{qt.title}</span>
                <span className="text-sm text-gray-600 leading-relaxed w-full whitespace-normal break-words">
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
