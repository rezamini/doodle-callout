import React from 'react';
import { UnderlineProps } from '../../types';

/**
 * WobblyUnderline — a hand-drawn style SVG underline.
 *
 * Uses a single quadratic Bézier curve (M2 7 Q50 1 98 7) to create a
 * gentle arc that reads as a "sketchy" underline. It is absolutely positioned
 * relative to its parent span, sitting 6px below the text baseline.
 *
 * viewBox: 0 0 100 9 with preserveAspectRatio="none" so it stretches
 * to match any word or phrase width.
 */
export const WobblyUnderline: React.FC<UnderlineProps> = ({
  color = 'currentColor',
  style,
  className,
}) => (
  <svg
    viewBox="0 0 100 9"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    focusable="false"
    style={{
      position: 'absolute',
      bottom: '-6px',
      left: 0,
      width: '100%',
      height: '9px',
      overflow: 'visible',
      ...style,
    }}
    className={className}
  >
    {/* Single-arc wave — dips above the baseline then curves back */}
    <path
      d="M2 7 Q50 1 98 7"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
