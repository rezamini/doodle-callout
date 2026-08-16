<div align="center">

# doodle-callout

**A zero-dependency React component for adding hand-drawn callout annotations to any layout.**

Perfect for SaaS landing pages, drawing attention to CTAs, and adding an organic, hand-drawn aesthetic that makes a page feel designed rather than generated. Pair it with a serif or handwriting font to give sign-up nudges, product announcements, and conversion-focused copy the kind of personality that stock illustrations and emoji can't.

[![npm version](https://img.shields.io/npm/v/doodle-callout.svg?style=flat-square&color=8b5cf6&label=npm)](https://www.npmjs.com/package/doodle-callout)
[![bundle size](https://img.shields.io/bundlephobia/minzip/doodle-callout?style=flat-square&color=8b5cf6)](https://bundlephobia.com/package/doodle-callout)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/doodle-callout.svg?style=flat-square&color=22c55e)](./LICENSE)
[![React](https://img.shields.io/badge/React-17%2B-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)

**[Live Demo →](https://your-username.github.io/doodle-callout)**

</div>

---

## Features

- 🎨 **Fully customizable** — colors, direction, font via simple props
- 🏹 **4 arrow directions** — `left`, `right`, `top`, `bottom` via CSS transforms
- 🔤 **Smart phrase matching** — case-insensitive underline on any substring of `children`
- 📦 **Dual format** — ships both ESM and CJS; works with Next.js, Vite, CRA
- 🔷 **TypeScript first** — full type declarations included, zero `@types/` packages needed
- 🪶 **Zero runtime dependencies** — React 17+ is the only peer requirement
- 🏗️ **Extensible architecture** — add new arrow/underline SVG variants without touching existing code

---

## When to use

- **SaaS landing pages** — point a hand-drawn arrow at your primary CTA without reaching for a design tool
- **Sign-up nudges** — underline phrases like *"Start for free"* or *"No credit card required"* with a sketchy stroke that feels human
- **Product announcements** — give launch pages a personal, hand-crafted quality that stock imagery doesn't provide
- **Marketing pages** — break out of polished, sterile layouts with an organic aesthetic that reads as genuine
- **Editorial UI** — complement newsletter-style or blog layouts with illustrative annotation

---

## Installation

```bash
npm install doodle-callout
# or
yarn add doodle-callout
# or
pnpm add doodle-callout
```

---

## Quick Start

```tsx
import { DoodleCallout } from 'doodle-callout';

export default function Hero() {
  return (
    <DoodleCallout
      underlineText="when we launch!"
      arrowColor="#f59e0b"
      underlineColor="#ec4899"
      textColor="#1f2937"
      style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '17px' }}
    >
      {`Be the first to know\nwhen we launch!`}
    </DoodleCallout>
  );
}
```

---

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | **Required.** The text content to render beside the arrow |
| `underlineText` | `string` | — | A phrase within `children` to underline (case-insensitive substring match) |
| `arrowColor` | `string` | `"currentColor"` | SVG stroke color for the arrow |
| `underlineColor` | `string` | `"currentColor"` | SVG stroke color for the wobbly underline |
| `textColor` | `string` | `"inherit"` | CSS `color` value applied to the text wrapper |
| `arrowDirection` | `'left' \| 'right' \| 'top' \| 'bottom'` | `"left"` | Which side the arrow appears on, implemented via CSS transform |
| `arrowVariant` | `'curved'` | `"curved"` | Arrow SVG variant (extensible — see **Contributing**) |
| `underlineVariant` | `'wobbly'` | `"wobbly"` | Underline SVG variant (extensible — see **Contributing**) |
| `className` | `string` | — | Additional CSS class on the root `<div>` |
| `style` | `CSSProperties` | — | Inline styles on the root `<div>` (cascade to text; use for `fontSize`, `fontFamily`, `fontStyle`) |

### `arrowDirection` details

The arrow SVG is a single path that natively points right. Direction is implemented via CSS transforms applied to the wrapper `<div>` — no extra SVG paths, no re-renders:

| Value | Flex layout | Transform |
|-------|-------------|-----------|
| `left` | `row` | none |
| `right` | `row-reverse` | `scaleX(-1)` |
| `top` | `column` | `rotate(90deg)` |
| `bottom` | `column-reverse` | `rotate(-90deg)` |

### `underlineText` matching

- **String children**: case-insensitive `indexOf` splits the string into `[before, <underlined />, after]`
- **JSX children**: the underline wraps the entire children block as a graceful fallback
- **No match / empty string**: renders children unchanged, no error thrown

---

## Examples

### Arrow on the right
```tsx
<DoodleCallout
  arrowDirection="right"
  arrowColor="#3b82f6"
  underlineColor="#f59e0b"
  underlineText="subscribe"
  textColor="#1e293b"
>
  Don't forget to subscribe
</DoodleCallout>
```

### Multiline with custom font
```tsx
<DoodleCallout
  underlineText="when we launch!"
  arrowColor="#8b5cf6"
  underlineColor="#ec4899"
  textColor="#f8fafc"
  style={{
    fontSize: '18px',
    fontFamily: 'Lora, Georgia, serif',
    fontStyle: 'italic',
    lineHeight: '1.4',
  }}
>
  {`Be the first to know\nwhen we launch!`}
</DoodleCallout>
```

### Arrow pointing down
```tsx
<DoodleCallout
  arrowDirection="bottom"
  arrowColor="oklch(0.7 0.15 30)"
  underlineColor="oklch(0.65 0.2 290)"
  underlineText="handcrafted"
>
  100% handcrafted with care
</DoodleCallout>
```

### Using SVG primitives directly
```tsx
import { CurvedArrow, WobblyUnderline } from 'doodle-callout';

// Build your own layout
<div className="flex gap-2">
  <CurvedArrow color="#f59e0b" />
  <span style={{ position: 'relative', display: 'inline-block' }}>
    Custom text
    <WobblyUnderline color="#ec4899" />
  </span>
</div>
```

---

## Running the Demo Locally

```bash
# 1. Install root dev dependencies (tsup, typescript)
npm install

# 2. Install demo dependencies (Vite, Tailwind v4, React)
cd demo && npm install

# 3. Start the demo (imports directly from ../src — no build step needed)
npm run dev
```

The demo runs at **http://localhost:5173**. Changes to `src/` hot-reload instantly via the Vite alias.

---

## Building the Library

```bash
# From the root
npm run build
# → dist/index.js   (CJS)
# → dist/index.mjs  (ESM)
# → dist/index.d.ts (types)
```

---

## Contributing

### Adding a new arrow variant

1. Create `src/svg/arrows/MyArrow.tsx` implementing `ArrowProps`
2. Add `'my-arrow'` to the `ArrowVariant` union in `src/types/index.ts`
3. Register it in the `ARROW_REGISTRY` map in `src/components/DoodleCallout.tsx`
4. Export it from `src/index.ts`

### Adding a new underline variant

Same process, under `src/svg/underlines/` and `UNDERLINE_REGISTRY`.

The registry pattern means existing behaviour is untouched — no risk of regressions.

---

## License

MIT © 2024 · See [LICENSE](./LICENSE)
