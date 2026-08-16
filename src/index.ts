/**
 * doodle-callout
 *
 * A lightweight, zero-dependency React component that renders text accompanied
 * by a customizable SVG "sketchy" underline and a hand-drawn directional arrow.
 *
 * @packageDocumentation
 */

// ─── Main Component ───────────────────────────────────────────────────────────
export { DoodleCallout } from './components/DoodleCallout';

// ─── SVG Primitives (for advanced composition) ────────────────────────────────
export { CurvedArrow } from './svg/arrows/CurvedArrow';
export { WobblyUnderline } from './svg/underlines/WobblyUnderline';

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  DoodleCalloutProps,
  ArrowProps,
  UnderlineProps,
  ArrowDirection,
  ArrowVariant,
  UnderlineVariant,
} from './types';
