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

  // Define shape-specific colors for better visibility and distinction
  const getShapeColor = (shapeType: string) => {
    switch (shapeType) {
      case 'circle':
        return 'bg-blue-500 border-blue-600';
      case 'triangle':
        return 'bg-green-500 border-green-600';
      case 'square':
        return 'bg-purple-500 border-purple-600';
      case 'star':
        return 'bg-yellow-500 border-yellow-600';
      case 'hexagon':
        return 'bg-orange-500 border-orange-600';
      case 'pentagon':
        return 'bg-pink-500 border-pink-600';
      case 'octagon':
        return 'bg-indigo-500 border-indigo-600';
      case 'diamond':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-gray-600 border-gray-700';
    }
  };

  const shapeColorClasses = getShapeColor(type);

  const baseClasses = `
    ${sizeClasses[size]}
    ${shapeColorClasses}
    border-2
    shadow-sm
    ${type === 'circle' ? 'rounded-full' : ''}
    ${type === 'triangle' ? 'clip-triangle' : ''}
    ${type === 'star' ? 'clip-star' : ''}
    ${type === 'hexagon' ? 'clip-hexagon' : ''}
    ${type === 'pentagon' ? 'clip-pentagon' : ''}
    ${type === 'octagon' ? 'clip-octagon' : ''}
    ${type === 'diamond' ? 'clip-diamond' : ''}
    ${interactive ? 'cursor-pointer hover:scale-110 hover:shadow-md transition-all duration-200' : ''}
    ${selected ? 'ring-2 ring-brand-purple ring-offset-2 scale-110' : ''}
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
