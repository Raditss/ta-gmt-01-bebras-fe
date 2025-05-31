import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QuestionType, QUESTION_TYPES } from "@/constants/questionTypes"

interface QuestionTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: QuestionType) => void;
}

export function QuestionTypeModal({ open, onClose, onSelectType }: QuestionTypeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Question Type</DialogTitle>
          <DialogDescription>
            Select the type of question you want to solve
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {QUESTION_TYPES.map((qt) => (
            <Button
              key={qt.type}
              variant="outline"
              className={`w-full h-auto p-4 flex flex-col items-start space-y-2 ${qt.color}`}
              onClick={() => onSelectType(qt.type)}
            >
              <span className="font-semibold">{qt.title}</span>
              <span className="text-sm text-gray-600">{qt.description}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 