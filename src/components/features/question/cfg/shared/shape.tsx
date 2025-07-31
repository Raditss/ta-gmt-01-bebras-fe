'use client';

import Image from 'next/image';
import { AVAILABLE_FISH } from '@/constants/shapes';

export interface ShapeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  interactive?: boolean;
  isFloating?: boolean; // New prop for floating animation
}

export function Shape({
  type,
  size = 'md',
  className = '',
  onClick,
  selected = false,
  interactive = false,
  isFloating = false
}: ShapeProps) {
  // Validate that type is provided
  if (!type || typeof type !== 'string') {
    console.error('Shape component received invalid type:', type);
    return (
      <div
        className={`w-10 h-10 bg-red-300 border border-red-500 flex items-center justify-center text-xs`}
        onClick={onClick}
        title="Invalid type"
      >
        ?
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const sizeValues = {
    sm: 32,
    md: 48,
    lg: 64
  };

  // Find fish data
  const fishData = AVAILABLE_FISH.find((fish) => fish.type === type);

  if (fishData) {
    // Render fish image
    const baseClasses = `
      ${sizeClasses[size]}
      relative
      transition-all duration-300 ease-in-out
      ${interactive ? 'cursor-pointer hover:scale-110' : ''}
      ${selected || isFloating ? 'scale-125' : ''}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div
        className={`${baseClasses} ${
          selected || isFloating
            ? 'ring-4 ring-blue-400 ring-opacity-75 rounded-lg bg-blue-100 bg-opacity-20 shadow-lg shadow-blue-400/50'
            : ''
        }`}
        onClick={onClick}
        title={fishData.name}
        style={{
          transform:
            selected || isFloating ? 'scale(1.2) rotateY(5deg)' : undefined,
          animation:
            selected || isFloating
              ? 'gentleFloat 2s ease-in-out infinite, pulse 1.5s ease-in-out infinite'
              : undefined
        }}
      >
        <Image
          src={fishData.path}
          alt={fishData.name}
          width={sizeValues[size]}
          height={sizeValues[size]}
          className="object-contain w-full h-full filter drop-shadow-sm"
          priority={size === 'md'} // Prioritize medium size (most common)
        />

        {/* Add the gentle floating animation and pulse effect */}
        <style jsx>{`
          @keyframes gentleFloat {
            0%,
            100% {
              transform: scale(1.2) translateY(0px) rotateY(5deg);
            }
            50% {
              transform: scale(1.2) translateY(-2px) rotateY(-3deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            }
            50% {
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
            }
          }
        `}</style>
      </div>
    );
  } else {
    // Unknown type - show error state
    return (
      <div
        className={`${sizeClasses[size]} bg-red-300 border border-red-500 flex items-center justify-center text-xs`}
        onClick={onClick}
        title={`Unknown fish type: ${type}`}
      >
        ?
      </div>
    );
  }
}

export function ShapeContainer({
  children,
  className = '',
  interactive = false,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const containerSize = children ? 'w-16 h-16' : 'w-12 h-12'; // Made slightly bigger for fish images

  return (
    <div
      className={`
        ${containerSize}
        flex items-center justify-center flex-shrink-0
        ${interactive ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
