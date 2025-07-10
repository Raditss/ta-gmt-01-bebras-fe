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

  // Calculate color based on progress - Green to Blue transition
  const getBarColor = () => {
    if (progressPercentage < 25) {
      // 0-25%: Pure green
      return 'from-green-500 to-green-300';
    } else if (progressPercentage < 50) {
      // 25-50%: Green to teal transition
      return 'from-green-500 to-teal-400';
    } else if (progressPercentage < 75) {
      // 50-75%: Teal to cyan transition
      return 'from-teal-400 to-cyan-400';
    } else {
      // 75-100%: Cyan to blue transition
      return 'from-cyan-400 to-blue-500';
    }
  };

  const getTimeColor = () => {
    if (progressPercentage < 25) {
      return 'text-green-600';
    } else if (progressPercentage < 50) {
      return 'text-teal-600';
    } else if (progressPercentage < 75) {
      return 'text-cyan-600';
    } else {
      return 'text-blue-600';
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
