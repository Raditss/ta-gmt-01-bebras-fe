'use client';

import { Clock } from 'lucide-react';

interface TimeProgressBarProps {
  currentDuration: number; // in seconds
  estimatedTime: number; // in seconds
  formattedDuration: string;
}

export function TimeProgressBar({
  currentDuration,
  estimatedTime,
  formattedDuration
}: TimeProgressBarProps) {
  // Calculate progress percentage (0-100)
  const progressPercentage = Math.min(
    (currentDuration / estimatedTime) * 100,
    100
  );

  // Calculate color based on progress
  // Green (0-60%), Yellow (60-80%), Orange (80-90%), Red (90%+)
  const getBarColor = () => {
    if (progressPercentage < 60) {
      return 'from-blue-500 to-blue-300';
    } else if (progressPercentage < 80) {
      return 'from-yellow-500 to-yellow-300';
    } else if (progressPercentage < 90) {
      return 'from-orange-500 to-orange-300';
    } else {
      return 'from-red-500 to-red-300';
    }
  };

  const getTimeColor = () => {
    if (progressPercentage < 60) {
      return 'text-blue-600';
    } else if (progressPercentage < 80) {
      return 'text-yellow-600';
    } else if (progressPercentage < 90) {
      return 'text-orange-600';
    } else {
      return 'text-red-600';
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-8 relative mb-6 overflow-hidden">
      {/* Progress bar background */}
      <div
        className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500 ease-out`}
        style={{ width: `${progressPercentage}%` }}
      />

      {/* Time display on top of the bar */}
      <div className="absolute inset-0 flex items-center justify-end pr-4">
        <div
          className={`flex items-center space-x-2 bg-white/90 px-3 py-1 rounded-full shadow-sm ${getTimeColor()}`}
        >
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm font-medium">
            {formattedDuration}
          </span>
          <span className="text-xs opacity-75">
            / {Math.floor(estimatedTime / 60)}m {estimatedTime % 60}s
          </span>
        </div>
      </div>
    </div>
  );
}
