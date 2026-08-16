import React, { CSSProperties } from 'react';
import { DoodleCalloutProps, ArrowDirection, ArrowVariant, UnderlineVariant } from '../types';
import { CurvedArrow } from '../svg/arrows/CurvedArrow';
import { WobblyUnderline } from '../svg/underlines/WobblyUnderline';

// ─── Arrow variant registry ───────────────────────────────────────────────────
// To add a new arrow: create it under src/svg/arrows/, import it here,
// add its key to the ArrowVariant union in src/types/index.ts, and register it.
const ARROW_REGISTRY: Record<ArrowVariant, React.FC<{ color?: string }>> = {
  curved: CurvedArrow,
};

// ─── Underline variant registry ───────────────────────────────────────────────
// To add a new underline: create it under src/svg/underlines/, import it here,
// add its key to the UnderlineVariant union in src/types/index.ts, and register it.
const UNDERLINE_REGISTRY: Record<UnderlineVariant, React.FC<{ color?: string }>> = {
  wobbly: WobblyUnderline,
};

// ─── Direction → layout map ───────────────────────────────────────────────────
// The arrow SVG natively points right. These transforms re-orient it for each
// direction while keeping the original path math intact.
const FLEX_DIRECTION: Record<ArrowDirection, CSSProperties['flexDirection']> = {
  left: 'row',
  right: 'row-reverse',
  top: 'column',
  bottom: 'column-reverse',
};

const ARROW_TRANSFORM: Record<ArrowDirection, string> = {
  left: 'none',
  right: 'scaleX(-1)',
  // rotate(90deg) CW takes the native right-pointing arrowhead to pointing DOWN,
  // which is toward the text sitting below the arrow in column layout.
  top: 'rotate(90deg)',
  bottom: 'rotate(-90deg)',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DoodleCallout
 *
 * Renders `children` accompanied by a hand-drawn SVG arrow and an optional
 * sketchy underline beneath a chosen phrase.
 *
 * @example
 * ```tsx
 * <DoodleCallout
 *   underlineText="when we launch!"
 *   arrowColor="#f59e0b"
 *   underlineColor="#ec4899"
 *   textColor="#374151"
 *   style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '17px' }}
 * >
 *   {`Be the first to know\nwhen we launch!`}
 * </DoodleCallout>
 * ```
 */
export const DoodleCallout: React.FC<DoodleCalloutProps> = ({
  children,
  underlineText,
  arrowColor = 'currentColor',
  underlineColor = 'currentColor',
  textColor = 'inherit',
  arrowDirection = 'left',
  arrowVariant = 'curved',
  underlineVariant = 'wobbly',
  className,
  style,
}) => {
  const ArrowComponent = ARROW_REGISTRY[arrowVariant];
  const UnderlineComponent = UNDERLINE_REGISTRY[underlineVariant];

  const isVertical = arrowDirection === 'top' || arrowDirection === 'bottom';

  /**
   * Renders children with the underline applied to the matched phrase.
   *
   * - String children → case-insensitive substring match; splits into
   *   [before, <underlined/>, after] fragments.
   * - Non-string children → underline wraps the entire children block
   *   (graceful fallback so the component never breaks).
   * - No underlineText or empty string → render children unchanged.
   */
  const renderContent = (): React.ReactNode => {
    if (!underlineText || underlineText.trim() === '') {
      return children;
    }

    if (typeof children === 'string') {
      const lower = children.toLowerCase();
      const lowerTarget = underlineText.toLowerCase();
      const idx = lower.indexOf(lowerTarget);

      if (idx === -1) {
        // Phrase not found — render normally without underline
        return children;
      }

      const before = children.slice(0, idx);
      const matched = children.slice(idx, idx + underlineText.length);
      const after = children.slice(idx + underlineText.length);

      return (
        <>
          {before}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {matched}
            <UnderlineComponent color={underlineColor} />
          </span>
          {after}
        </>
      );
    }

    // Non-string children fallback: wrap all content with underline
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {children}
        <UnderlineComponent color={underlineColor} />
      </span>
    );
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: FLEX_DIRECTION[arrowDirection],
        alignItems: 'flex-start',
        gap: '10px',
        color: textColor,
        ...style,
      }}
    >
      {/* Arrow wrapper — applies direction transform without modifying the SVG */}
      <div
        style={{
          transform: ARROW_TRANSFORM[arrowDirection],
          marginTop: isVertical ? 0 : '8px',
          flexShrink: 0,
        }}
      >
        <ArrowComponent color={arrowColor} />
      </div>

      {/* Text content — white-space: pre-wrap lets "\n" in string children render as line breaks */}
      <span
        style={{
          paddingTop: '4px',
          position: 'relative',
          whiteSpace: 'pre-wrap',
        }}
      >
        {renderContent()}
      </span>
    </div>
  );
};
