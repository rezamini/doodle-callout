import React from 'react';
import { ArrowProps } from '../../types';

/**
 * CurvedArrow — a hand-drawn style SVG arrow.
 *
 * The path curves upward from bottom-left to upper-right, with a two-stroke
 * arrowhead at the tip. The arrow natively "points right"; direction transforms
 * (scaleX, rotate) are applied by the parent `<DoodleCallout>` wrapper so this
 * component stays a pure, stateless SVG.
 *
 * viewBox: 0 0 52 30  (matches original reference dimensions: 48×27px rendered)
 */
export const CurvedArrow: React.FC<ArrowProps> = ({
  color = 'currentColor',
  style,
  className,
}) => (
  <svg
    viewBox="0 0 52 30"
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={{
      width: 48,
      height: 27,
      display: 'block',
      ...style,
    }}
    className={className}
  >
    {/* Curved body — sweeps from bottom-left up to the arrowhead */}
    <path
      d="M2 22C10 14 28 -1 50 13"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Arrowhead — two-stroke open chevron at the tip */}
    <path
      d="M42 6 L51 14 L40 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
