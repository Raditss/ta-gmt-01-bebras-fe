'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CipherVertex {
  pos: number;
  letters: string;
}

interface CipherConfig {
  vertexCount: number;
  polygonName: string;
  startingVertex: number;
  isClockwise: boolean;
}

interface CipherWheelProps {
  vertices: CipherVertex[];
  config: CipherConfig;
  highlightedVertex?: number;
}

export const CipherWheel: React.FC<CipherWheelProps> = ({
  vertices,
  config,
  highlightedVertex
}) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const svgSize = 300;

  // Calculate vertex positions on the circle
  const getVertexPosition = (index: number) => {
    const angle = (2 * Math.PI * index) / config.vertexCount - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  // Get SVG path for the polygon
  const getPolygonPath = () => {
    const points = vertices
      .map((_, index) => {
        const pos = getVertexPosition(index);
        return `${pos.x},${pos.y}`;
      })
      .join(' ');
    return `M ${points.split(' ')[0]} ${points
      .split(' ')
      .slice(1)
      .map((p) => `L ${p}`)
      .join(' ')} Z`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg
          width={svgSize}
          height={svgSize}
          className="border rounded-lg bg-gray-50"
        >
          {/* Polygon outline */}
          <path
            d={getPolygonPath()}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Center dot */}
          <circle cx={centerX} cy={centerY} r="3" fill="#6b7280" />

          {/* Vertices */}
          {vertices.map((vertex, index) => {
            const pos = getVertexPosition(index);
            const isStarting = index === config.startingVertex;
            const isHighlighted = highlightedVertex === index;

            return (
              <g key={vertex.pos}>
                {/* Vertex circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isStarting ? '12' : '8'}
                  fill={
                    isStarting
                      ? '#10b981'
                      : isHighlighted
                        ? '#f59e0b'
                        : '#3b82f6'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Vertex number */}
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>

                {/* Letters near vertex */}
                <text
                  x={pos.x}
                  y={pos.y - 20}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="12"
                  fontWeight="medium"
                >
                  {vertex.letters}
                </text>
              </g>
            );
          })}

          {/* Direction indicator */}
          {config.vertexCount > 0 && (
            <g>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
              </defs>

              {/* Direction arc */}
              {config.isClockwise ? (
                // Clockwise: arc on the right side
                <path
                  d={`M ${centerX + 40} ${centerY} A 40 40 0 0 1 ${centerX + 40 * Math.cos(Math.PI / 3)} ${centerY + 40 * Math.sin(Math.PI / 3)}`}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              ) : (
                // Counter-clockwise: arc on the left side
                <path
                  d={`M ${centerX - 40} ${centerY} A 40 40 0 0 0 ${centerX - 40 * Math.cos(Math.PI / 3)} ${centerY + 40 * Math.sin(Math.PI / 3)}`}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Start</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Vertex</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          {config.polygonName} ({config.vertexCount} vertices)
        </Badge>

        <div className="text-sm text-gray-600 space-y-1">
          <div>Starting at: Vertex {config.startingVertex + 1}</div>
          <div>
            Direction: {config.isClockwise ? 'Clockwise' : 'Counter-clockwise'}
          </div>
        </div>
      </div>
    </div>
  );
};
