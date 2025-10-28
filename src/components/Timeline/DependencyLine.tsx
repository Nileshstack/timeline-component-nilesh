import React from 'react';

interface DependencyLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
}

export const DependencyLine: React.FC<DependencyLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  stroke = '#94a3b8',   
  strokeWidth = 2,
}) => {
  const dx = Math.max(24, Math.abs(x2 - x1) / 2);
  const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 10 5, 0 10" fill={stroke} />
        </marker>
      </defs>

      <path
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd="url(#arrowhead)"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </svg>
  );
};

export default DependencyLine;
