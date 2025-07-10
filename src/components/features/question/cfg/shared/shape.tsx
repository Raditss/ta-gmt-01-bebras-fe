'use client';

export interface ShapeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  interactive?: boolean;
}

export function Shape({
  type,
  size = 'md',
  className = '',
  onClick,
  selected = false,
  interactive = false
}: ShapeProps) {
  // Validate that type is provided
  if (!type || typeof type !== 'string') {
    console.error('ShapeShared component received invalid type:', type);
    return (
      <div
        className={`w-10 h-10 bg-red-300 border border-red-500 flex items-center justify-center text-xs`}
        onClick={onClick}
        title="Invalid shape type"
      >
        ?
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const baseClasses = `
    ${sizeClasses[size]}
    bg-gray-300
    ${type === 'circle' ? 'rounded-full' : ''}
    ${type === 'triangle' ? 'clip-triangle' : ''}
    ${type === 'star' ? 'clip-star' : ''}
    ${type === 'hexagon' ? 'clip-hexagon' : ''}
    ${type === 'pentagon' ? 'clip-pentagon' : ''}
    ${type === 'octagon' ? 'clip-octagon' : ''}
    ${type === 'diamond' ? 'clip-diamond' : ''}
    ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
    ${selected ? 'ring-2 ring-blue-500' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return <div className={baseClasses} onClick={onClick} />;
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
  const containerSize = children ? 'w-12 h-12' : 'w-8 h-8';

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
