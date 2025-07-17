'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target } from 'lucide-react';

export function CipherNHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objective
        </h3>
        <p className="text-gray-700">
          Decrypt the message by finding the correct letter at the specified
          position after rotating the cipher wheel by the given number of steps.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How to Solve
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Step 1: Understand the Wheel
            </h4>
            <p className="text-blue-700 text-sm">
              The cipher wheel is represented as a polygon where each vertex
              contains letters. The current vertex is highlighted in green, and
              the target vertex (after rotation) will be highlighted in red.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Step 2: Calculate Rotation
            </h4>
            <p className="text-green-700 text-sm">
              Enter the number of steps to rotate clockwise from the current
              vertex. The rotation will determine which vertex becomes the
              target.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Step 3: Find the Letter
            </h4>
            <p className="text-purple-700 text-sm">
              Enter the position number (1, 2, 3, etc.) to identify which letter
              from the target vertex&apos;s letter sequence you need to find.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Visual Aid:</strong> The polygon visualization shows the
              current vertex in green and the target vertex in red. The arrow
              points to the target vertex.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Position Counting:</strong> Letter positions start from 1,
              not 0. For example, if a vertex has letters &quot;ABC&quot;,
              position 1 is &quot;A&quot;, position 2 is &quot;B&quot;, etc.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Rotation Direction:</strong> Rotations direction is
              specified in the question.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Example</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Given:</strong> Current vertex has letters
            &quot;HELLO&quot;, rotation = 2, position = 3
          </p>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> Rotate 2 steps clockwise to reach the
            target vertex, then find the 3rd letter in that vertex&apos;s letter
            sequence.
          </p>
        </div>
      </div>
    </div>
  );
}
