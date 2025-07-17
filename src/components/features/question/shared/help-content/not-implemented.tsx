'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, BookOpen } from 'lucide-react';

export function NotImplementedHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Help Not Available
        </h3>
        <p className="text-gray-700">
          Help content for this question type is not yet available. Please refer
          to the question description and instructions for guidance on how to
          solve this problem.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          General Tips
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Read the Instructions Carefully
            </h4>
            <p className="text-blue-700 text-sm">
              Make sure to read all the provided instructions and question
              description thoroughly. The problem description usually contains
              important clues about how to approach the solution.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Understand the Objective
            </h4>
            <p className="text-green-700 text-sm">
              Identify what the question is asking you to do. Look for keywords
              like &quot;find&quot;, &quot;calculate&quot;,
              &quot;determine&quot;, or &quot;solve&quot; to understand the
              expected outcome.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Break Down the Problem
            </h4>
            <p className="text-purple-700 text-sm">
              Try to break the problem into smaller, manageable steps. This
              often makes complex problems easier to understand and solve.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Learning Resources
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Course Materials:</strong> Review your course materials,
              textbooks, and lecture notes for relevant concepts and examples.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Practice Problems:</strong> Look for similar practice
              problems or examples that might help you understand the approach.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Ask for Help:</strong> Don&apos;t hesitate to ask your
              instructor or classmates for clarification if you&apos;re stuck.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-600">
          Problem-Solving Strategy
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-700">
            <strong>1. Understand:</strong> Read the problem carefully and
            identify what you need to find.
          </p>
          <p className="text-sm text-gray-700">
            <strong>2. Plan:</strong> Think about the steps you need to take to
            reach the solution.
          </p>
          <p className="text-sm text-gray-700">
            <strong>3. Execute:</strong> Follow your plan step by step, checking
            your work as you go.
          </p>
          <p className="text-sm text-gray-700">
            <strong>4. Review:</strong> Double-check your answer and make sure
            it makes sense.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">General Help</Badge>
        <Badge variant="secondary">Problem Solving</Badge>
        <Badge variant="secondary">Learning Resources</Badge>
        <Badge variant="secondary">Study Tips</Badge>
      </div>
    </div>
  );
}
