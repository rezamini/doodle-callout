import { CSSProperties, ReactNode } from 'react';

// ─── Direction ───────────────────────────────────────────────────────────────

/** Which side the arrow appears relative to the text. */
export type ArrowDirection = 'left' | 'right' | 'top' | 'bottom';

// ─── Variants ────────────────────────────────────────────────────────────────

/**
 * Arrow SVG variant identifier.
 * Add new string literals here as new arrow components are created under
 * `src/svg/arrows/`.
 */
export type ArrowVariant = 'curved';

/**
 * Underline SVG variant identifier.
 * Add new string literals here as new underline components are created under
 * `src/svg/underlines/`.
 */
export type UnderlineVariant = 'wobbly';

// ─── Sub-component Props ──────────────────────────────────────────────────────

/** Props accepted by every arrow SVG component. */
export interface ArrowProps {
  /** SVG stroke color. Accepts any valid CSS color string. @default "currentColor" */
  color?: string;
  /** Additional inline styles applied to the `<svg>` element. */
  style?: CSSProperties;
  /** Additional className applied to the `<svg>` element. */
  className?: string;
}

/** Props accepted by every underline SVG component. */
export interface UnderlineProps {
  /** SVG stroke color. Accepts any valid CSS color string. @default "currentColor" */
  color?: string;
  /** Additional inline styles applied to the `<svg>` element. */
  style?: CSSProperties;
  /** Additional className applied to the `<svg>` element. */
  className?: string;
}

// ─── Main Component Props ─────────────────────────────────────────────────────

/** Props for the `<DoodleCallout>` component. */
export interface DoodleCalloutProps {
  /**
   * The text or JSX content to display beside the arrow.
   * When a plain string, the `underlineText` matching is applied automatically.
   */
  children: ReactNode;

  /**
   * A phrase to underline within `children`.
   * Matching is **case-insensitive** and uses substring search.
   * If `children` is not a string, the underline wraps the entire children block.
   */
  underlineText?: string;

  /**
   * SVG stroke color for the arrow.
   * @default "currentColor"
   */
  arrowColor?: string;

  /**
   * SVG stroke color for the wobbly underline.
   * @default "currentColor"
   */
  underlineColor?: string;

  /**
   * CSS `color` value applied to the text wrapper.
   * @default "inherit"
   */
  textColor?: string;

  /**
   * Controls which side of the text the arrow is placed on.
   * Implemented via CSS `flexDirection` + `transform` on the arrow wrapper —
   * no extra SVG paths needed.
   * @default "left"
   */
  arrowDirection?: ArrowDirection;

  /**
   * Selects which arrow SVG component to render.
   * Extend `ArrowVariant` and the internal registry as new arrows are added.
   * @default "curved"
   */
  arrowVariant?: ArrowVariant;

  /**
   * Selects which underline SVG component to render.
   * Extend `UnderlineVariant` and the internal registry as new underlines are added.
   * @default "wobbly"
   */
  underlineVariant?: UnderlineVariant;

  /** Additional CSS class applied to the root `<div>`. */
  className?: string;

  /**
   * Inline styles applied to the root `<div>`.
   * Use this to set `fontSize`, `fontFamily`, `fontStyle`, `lineHeight`, etc.
   * These cascade naturally to the text span via CSS inheritance.
   */
  style?: CSSProperties;
}
