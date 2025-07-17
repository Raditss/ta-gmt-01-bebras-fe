import { Badge } from '@/components/ui/badge';

export interface RingVisualizationProps {
  rings: Array<{ id: number; letters: string[]; currentPosition: number }>;
  ringPositions: number[];
  highlightedRing?: number;
  highlightedLetter?: { ring: number; letter: string };
}

export function RingVisualization({
  rings,
  ringPositions,
  highlightedRing,
  highlightedLetter
}: RingVisualizationProps) {
  const centerX = 250;
  const centerY = 250;
  const maxRadius = 220;
  const minRadius = 60;
  const ringColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox="0 0 500 500"
        className="border-2 border-gray-300 rounded-lg bg-white w-full max-w-[500px] h-auto aspect-square"
      >
        <polygon
          points={`${centerX},15 ${centerX - 8},5 ${centerX + 8},5`}
          fill="red"
          className="drop-shadow"
        />
        {rings
          .slice()
          .reverse()
          .map((ring, reverseIndex) => {
            const ringIndex = rings.length - 1 - reverseIndex;
            const radiusStep =
              (maxRadius - minRadius) / Math.max(rings.length - 1, 1);
            const radius = minRadius + radiusStep * ringIndex;
            const isHighlighted = ringIndex === highlightedRing;
            const currentPosition = ringPositions[ringIndex] || 0;
            const angleStep = (2 * Math.PI) / ring.letters.length;
            const rotationAngle =
              -(currentPosition * angleStep * 180) / Math.PI;
            return (
              <g key={ring.id}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={
                    isHighlighted
                      ? ringColors[ringIndex % ringColors.length]
                      : '#D1D5DB'
                  }
                  strokeWidth={isHighlighted ? '4' : '2'}
                  className="transition-all duration-500"
                />
                <g
                  transform={`rotate(${rotationAngle} ${centerX} ${centerY})`}
                  className="transition-all duration-500 ease-in-out"
                >
                  {ring.letters.map((letter, letterIndex) => {
                    const angle = letterIndex * angleStep - Math.PI / 2;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    const isAtMarker = letterIndex === currentPosition;
                    const isTargetLetter =
                      highlightedLetter &&
                      highlightedLetter.ring === ringIndex &&
                      highlightedLetter.letter === letter;
                    return (
                      <g key={letterIndex}>
                        <circle
                          cx={x}
                          cy={y}
                          r="15"
                          fill={
                            isTargetLetter
                              ? '#FDE68A'
                              : isAtMarker
                                ? '#FEF3C7'
                                : 'white'
                          }
                          stroke={
                            isTargetLetter
                              ? '#D97706'
                              : isAtMarker
                                ? '#F59E0B'
                                : ringColors[ringIndex % ringColors.length]
                          }
                          strokeWidth={
                            isTargetLetter ? '3' : isAtMarker ? '3' : '2'
                          }
                          className="transition-all duration-300"
                        />
                        <text
                          x={x}
                          y={y + 5}
                          textAnchor="middle"
                          transform={`rotate(${-rotationAngle} ${x} ${y})`}
                          className={`text-sm font-bold transition-all duration-300 ${
                            isTargetLetter
                              ? 'fill-white'
                              : isAtMarker
                                ? 'fill-orange-700'
                                : 'fill-gray-700'
                          }`}
                        >
                          {letter}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        <circle cx={centerX} cy={centerY} r="5" fill="black" />
      </svg>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {rings.map((ring, index) => (
          <Badge
            key={ring.id}
            variant="outline"
            className={`text-sm px-3 py-1 ${index === highlightedRing ? 'border-2' : 'border'}`}
            style={{
              borderColor: ringColors[index % ringColors.length],
              backgroundColor:
                index === highlightedRing
                  ? `${ringColors[index % ringColors.length]}20`
                  : 'white'
            }}
          >
            Ring {ring.id}: Position {ringPositions[index] || 0}
          </Badge>
        ))}
      </div>
    </div>
  );
}
