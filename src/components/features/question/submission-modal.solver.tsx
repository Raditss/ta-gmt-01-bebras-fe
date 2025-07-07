import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SubmissionResult {
  isCorrect: boolean;
  points: number;
  streak: number;
  timeTaken: number;
  // Add other statistics as needed
}

interface SubmissionModalProps {
  isOpen: boolean;
  isConfirming: boolean;
  result: SubmissionResult | null;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function SubmissionModalSolver({
  isOpen,
  isConfirming,
  result,
  onConfirm,
  onCancel,
  onClose,
}: SubmissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isConfirming ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your answer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : result ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={result.isCorrect ? "text-green-600" : "text-red-600"}>
              {result.isCorrect ? "Correct Answer!" : "Incorrect Answer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Points Earned</p>
                <p className="text-lg font-semibold">{result.points}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-lg font-semibold">{result.streak}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time Taken</p>
                <p className="text-lg font-semibold">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  )
} 