'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target, RotateCcw } from 'lucide-react';

export function RingCipherHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objective
        </h3>
        <p className="text-gray-700">
          Decrypt the message by rotating the concentric rings to align the
          correct letters and find the letter at the specified position on the
          target ring.
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
              Step 1: Understand the Rings
            </h4>
            <p className="text-blue-700 text-sm">
              The cipher consists of multiple concentric rings, each with
              letters arranged in a circle. Each ring can rotate independently.
              The red arrow at the top indicates the reference position.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Step 2: Select Target Ring
            </h4>
            <p className="text-green-700 text-sm">
              Enter the ring number (1, 2, 3, etc.) that you want to rotate.
              Ring 1 is the innermost ring, and the numbers increase outward.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Step 3: Calculate Rotation Steps
            </h4>
            <p className="text-purple-700 text-sm">
              Enter the number of steps to rotate the selected ring. Positive
              numbers rotate clockwise, negative numbers rotate
              counter-clockwise. Each step moves the ring by one letter
              position.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">
              Step 4: Find the Letter
            </h4>
            <p className="text-orange-700 text-sm">
              After rotating, identify the letter at the reference position
              (marked by the red arrow) on the target ring. This letter is your
              answer.
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
              <strong>Ring Numbering:</strong> Rings are numbered from inside
              out. Ring 1 is the innermost, Ring 2 is the second ring, and so
              on.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Reference Position:</strong> The red arrow at the top of
              the visualization shows the reference position where you need to
              read the final letter.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Rotation Direction:</strong> You&apos;re counting the
              steps clockwise from the reference position. You can use the
              preview to see how the rotation affects the ring positions.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Visual Feedback:</strong> The selected ring will be
              highlighted with a different color and border to help you track
              which ring you&apos;re working with.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Example</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Given:</strong> Ring 2 has letters &quot;ABCDEF&quot;,
            rotate by 3 steps clockwise
          </p>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> After rotating 3 steps clockwise, the
            letter at the reference position (marked by the red arrow) on Ring 2
            will be your answer.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Ring Mechanics
        </h3>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-700 text-sm">
            Each ring rotates independently around the center. When you rotate a
            ring, all the letters on that ring move together while other rings
            remain stationary. The goal is to align the correct letters across
            all rings to form the decrypted message.
          </p>
        </div>
      </div>
    </div>
  );
}
