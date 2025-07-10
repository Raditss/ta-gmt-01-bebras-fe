import React from 'react';
import { Clock } from 'lucide-react';

interface TimeProgressBarProps {
  duration: number; // duration in seconds
  formattedTime: string; // formatted time string like "01:10"
}

export function TimeProgressBar({ duration, formattedTime }: TimeProgressBarProps) {
  // Calculate progress percentage, capping at 98% for infinite growth
  // Using a logarithmic scale to slow down progress over time
  const getProgressPercentage = (seconds: number) => {
    if (seconds <= 0) return 0;
    
    // Use a logarithmic function that approaches but never reaches 100%
    // This creates a nice visual effect where progress slows down over time
    const maxPercentage = 98;
    const scaleFactor = 120; // Adjust this to control how quickly it approaches max
    
    const percentage = maxPercentage * (1 - Math.exp(-seconds / scaleFactor));
    return Math.min(percentage, maxPercentage);
  };

  const progressPercentage = getProgressPercentage(duration);

  return (
    <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        {/* Progress bar */}
        <div className="flex-1 mr-6">
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Timer display */}
        <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 min-w-[100px]">
          <Clock className="w-5 h-5" />
          <span className="font-mono text-base font-medium">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
} 