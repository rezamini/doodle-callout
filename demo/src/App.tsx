import React, { useState, useCallback, useId } from 'react';
import { DoodleCallout } from 'doodle-callout';
import type { ArrowDirection } from 'doodle-callout';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_TEXT = "Be the first to know\nwhen we launch!";
const DEFAULT_UNDERLINE_TEXT = "when we launch!";
const DEFAULT_ARROW_COLOR = "#f59e0b";
const DEFAULT_UNDERLINE_COLOR = "#ec4899";
const DEFAULT_TEXT_COLOR = "#e2e8f0";
const DEFAULT_FONT_SIZE = 17;
const DEFAULT_FONT_STYLE = "italic";

type FontPreset = 'serif' | 'sans' | 'mono';
const FONT_PRESETS: Record<FontPreset, string> = {
  serif: 'Lora, Georgia, serif',
  sans: 'Inter, system-ui, sans-serif',
  mono: "'JetBrains Mono', monospace",
};

const ARROW_DIRECTIONS: ArrowDirection[] = ['left', 'right', 'top', 'bottom'];

// ─── Code generator ───────────────────────────────────────────────────────────

interface CodeConfig {
  text: string;
  underlineText: string;
  arrowColor: string;
  underlineColor: string;
  textColor: string;
  arrowDirection: ArrowDirection;
  fontSize: number;
  fontPreset: FontPreset;
  fontStyle: string;
}

function generateCode(cfg: CodeConfig): string {
  const lines: string[] = [];
  lines.push(`import { DoodleCallout } from 'doodle-callout';`);
  lines.push('');

  const props: string[] = [];
  if (cfg.underlineText) props.push(`underlineText="${cfg.underlineText}"`);
  if (cfg.arrowColor !== 'currentColor') props.push(`arrowColor="${cfg.arrowColor}"`);
  if (cfg.underlineColor !== 'currentColor') props.push(`underlineColor="${cfg.underlineColor}"`);
  if (cfg.textColor !== 'inherit') props.push(`textColor="${cfg.textColor}"`);
  if (cfg.arrowDirection !== 'left') props.push(`arrowDirection="${cfg.arrowDirection}"`);

  const styleEntries: string[] = [];
  if (cfg.fontSize !== DEFAULT_FONT_SIZE) styleEntries.push(`fontSize: '${cfg.fontSize}px'`);
  if (cfg.fontPreset !== 'serif') styleEntries.push(`fontFamily: '${FONT_PRESETS[cfg.fontPreset]}'`);
  if (cfg.fontStyle !== DEFAULT_FONT_STYLE) styleEntries.push(`fontStyle: '${cfg.fontStyle}'`);
  if (styleEntries.length > 0) props.push(`style={{ ${styleEntries.join(', ')} }}`);

  const indent = '  ';
  if (props.length > 0) {
    lines.push('<DoodleCallout');
    props.forEach(p => lines.push(`${indent}${p}`));
    lines.push('>');
  } else {
    lines.push('<DoodleCallout>');
  }

  if (cfg.text.includes('\n')) {
    lines.push(`${indent}{\`${cfg.text}\`}`);
  } else {
    lines.push(`${indent}${cfg.text}`);
  }

  lines.push('</DoodleCallout>');
  return lines.join('\n');
}

// ─── Syntax highlighter ───────────────────────────────────────────────────────

interface Token { text: string; color: string }

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  if (!line) {
    tokens.push({ text: '\n', color: 'transparent' });
    return tokens;
  }

  // Import line
  if (line.startsWith('import')) {
    tokens.push({ text: line, color: '#64748b' });
    return tokens;
  }

  // Closing tag
  if (/^<\/[A-Z]/.test(line.trim())) {
    tokens.push({ text: line, color: '#f472b6' });
    return tokens;
  }

  // Opening tag line `<ComponentName` or `<ComponentName>`
  if (/^<[A-Z]/.test(line.trim())) {
    const tagMatch = line.match(/^(<[A-Z]\w*)(>?)$/);
    if (tagMatch) {
      tokens.push({ text: tagMatch[1], color: '#f472b6' });
      if (tagMatch[2]) tokens.push({ text: tagMatch[2], color: '#94a3b8' });
      return tokens;
    }
    tokens.push({ text: line, color: '#f472b6' });
    return tokens;
  }

  // Closing `>` alone
  if (line.trim() === '>') {
    tokens.push({ text: line, color: '#94a3b8' });
    return tokens;
  }

  // Prop line: indented, contains `=`
  const propMatch = line.match(/^(\s+)([a-zA-Z]\w*)=(.*)/);
  if (propMatch) {
    const [, indent, attr, value] = propMatch;
    tokens.push({ text: indent, color: 'transparent' });
    tokens.push({ text: attr, color: '#93c5fd' });
    tokens.push({ text: '=', color: '#94a3b8' });
    const valueColor = value.startsWith('"') ? '#86efac' : value.startsWith('{') ? '#fbbf24' : '#e2e8f0';
    tokens.push({ text: value, color: valueColor });
    return tokens;
  }

  // Template literal children
  if (line.trim().startsWith('{`') || line.trim().startsWith('  {`')) {
    const indent = line.slice(0, line.indexOf('{'));
    tokens.push({ text: indent, color: 'transparent' });
    tokens.push({ text: line.trim(), color: '#fbbf24' });
    return tokens;
  }

  // Plain children text
  if (line.startsWith('  ') && !line.trim().startsWith('<')) {
    tokens.push({ text: line, color: '#e2e8f0' });
    return tokens;
  }

  tokens.push({ text: line, color: '#c4b5fd' });
  return tokens;
}

function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <pre className="code-block p-4 overflow-x-auto leading-relaxed whitespace-pre">
      {lines.map((line, i) => {
        const tokens = tokenizeLine(line);
        return (
          <div key={i}>
            {tokens.map((tok, j) =>
              tok.text === '\n' ? null : (
                <span key={j} style={{ color: tok.color }}>
                  {tok.text}
                </span>
              )
            )}
          </div>
        );
      })}
    </pre>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}

function ColorRow({ label, value, onChange, id }: ColorRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0 w-8 h-8">
        <input
          type="color"
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`${label} color picker`}
        />
        <label
          htmlFor={id}
          className="block w-8 h-8 rounded-lg cursor-pointer border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: value,
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        />
      </div>
      <span className="text-xs text-slate-400 w-16 flex-shrink-0">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        spellCheck={false}
        aria-label={`${label} hex value`}
      />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const uid = useId();

  // ── State ──
  const [text, setText] = useState(DEFAULT_TEXT);
  const [underlineText, setUnderlineText] = useState(DEFAULT_UNDERLINE_TEXT);
  const [arrowColor, setArrowColor] = useState(DEFAULT_ARROW_COLOR);
  const [underlineColor, setUnderlineColor] = useState(DEFAULT_UNDERLINE_COLOR);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [arrowDirection, setArrowDirection] = useState<ArrowDirection>('left');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontPreset, setFontPreset] = useState<FontPreset>('serif');
  const [fontStyle, setFontStyle] = useState(DEFAULT_FONT_STYLE);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const fontFamily = FONT_PRESETS[fontPreset];

  const code = generateCode({
    text, underlineText, arrowColor, underlineColor, textColor,
    arrowDirection, fontSize, fontPreset, fontStyle,
  });

  // ── Handlers ──
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch { /* ignore */ }
  }, [code]);

  const handleCopyInstall = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('npm install doodle-callout');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2200);
    } catch { /* ignore */ }
  }, []);

  const handleReset = useCallback(() => {
    setText(DEFAULT_TEXT);
    setUnderlineText(DEFAULT_UNDERLINE_TEXT);
    setArrowColor(DEFAULT_ARROW_COLOR);
    setUnderlineColor(DEFAULT_UNDERLINE_COLOR);
    setTextColor(DEFAULT_TEXT_COLOR);
    setArrowDirection('left');
    setFontSize(DEFAULT_FONT_SIZE);
    setFontPreset('serif');
    setFontStyle(DEFAULT_FONT_STYLE);
  }, []);

  // ── Render ──
  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%), #07070f',
      }}
    >
      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: '#a78bfa' }}>
                <path d="M3 17C7 10 17 4 21 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 5 L21 10 L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 21 Q8 18.5 13 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm text-white">doodle-callout</span>
              <span className="text-xs font-mono" style={{ color: 'rgba(139,92,246,0.7)' }}>v0.1.0</span>
            </div>
          </div>
          <nav className="flex items-center gap-5">
            <a
              href="https://www.npmjs.com/package/doodle-callout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.331h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
              </svg>
              npm
            </a>
            <a
              href="https://github.com/your-username/doodle-callout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10 text-center">
        {/* Tech badges — three separate, muted developer-tool style tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-7">
          {([
            { label: 'Zero Dependencies', accent: '#22c55e' },
            { label: 'TypeScript',        accent: '#3b82f6' },
            { label: 'ESM + CJS',         accent: '#f59e0b' },
          ] as const).map(badge => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: badge.accent }}
              />
              {badge.label}
            </span>
          ))}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
          Hand-drawn{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            callouts
          </span>{' '}
          for React
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          A React component with sketchy SVG underlines and hand-drawn directional arrows.
          Good for SaaS landing pages, drawing attention to CTAs, and adding an organic,
          hand-drawn aesthetic anywhere a polished layout needs a human touch.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-7">
          {[
            { icon: '🎨', label: 'Custom colors' },
            { icon: '🏹', label: '4 arrow directions' },
            { icon: '🔤', label: 'Smart underline matching' },
            { icon: '📦', label: 'ESM + CJS' },
            { icon: '🔷', label: 'TypeScript first' },
          ].map(f => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-slate-300"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* ── Left column: Preview + Install + Code ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Live Preview Card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(248,113,113,0.6)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(251,191,36,0.6)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(74,222,128,0.6)' }} />
              <span className="ml-2 text-xs font-mono" style={{ color: 'rgba(148,163,184,0.6)' }}>
                preview
              </span>
              <div
                className="ml-auto text-xs flex items-center gap-1.5"
                style={{ color: 'rgba(139,92,246,0.7)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#a78bfa' }} />
                LIVE
              </div>
            </div>
            {/* Preview area */}
            <div className="dot-grid flex items-center justify-center min-h-44 p-10">
              <DoodleCallout
                underlineText={underlineText}
                arrowColor={arrowColor}
                underlineColor={underlineColor}
                textColor={textColor}
                arrowDirection={arrowDirection}
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  fontStyle,
                  lineHeight: '1.4',
                  letterSpacing: fontPreset === 'mono' ? '-0.02em' : undefined,
                }}
              >
                {text}
              </DoodleCallout>
            </div>
          </div>

          {/* Install snippet */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Installation
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <code className="text-sm font-mono" style={{ color: '#a78bfa' }}>
                npm install doodle-callout
              </code>
              <button
                id="copy-install-btn"
                onClick={handleCopyInstall}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: copiedInstall ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.15)',
                  color: copiedInstall ? '#4ade80' : '#a78bfa',
                  border: copiedInstall ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(139,92,246,0.3)',
                }}
              >
                {copiedInstall ? (
                  <span className="fade-in-up">✓ Copied</span>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6Z" />
                      <path d="M2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Code */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Generated Code
              </span>
              <button
                id="copy-code-btn"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: copiedCode ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.15)',
                  color: copiedCode ? '#4ade80' : '#a78bfa',
                  border: copiedCode ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(139,92,246,0.3)',
                }}
              >
                {copiedCode ? (
                  <span className="fade-in-up flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6Z" />
                      <path d="M2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <CodeBlock code={code} />
          </div>
        </div>

        {/* ── Right column: Controls ── */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-5 sticky top-6">
            <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: '#a78bfa' }}>
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Customize
            </h2>

            <div className="flex flex-col gap-5">
              {/* Text Content */}
              <div>
                <label
                  htmlFor={`${uid}-text`}
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  Text Content
                </label>
                <textarea
                  id={`${uid}-text`}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-mono text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  spellCheck={false}
                />
                <p className="text-xs text-slate-600 mt-1">Use ↵ for line breaks</p>
              </div>

              {/* Underline Phrase */}
              <div>
                <label
                  htmlFor={`${uid}-underline`}
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  Underline Phrase
                  <span className="ml-1.5 text-slate-600">(case-insensitive)</span>
                </label>
                <input
                  id={`${uid}-underline`}
                  type="text"
                  value={underlineText}
                  onChange={e => setUnderlineText(e.target.value)}
                  placeholder="phrase within the text…"
                  className="w-full text-xs font-mono text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Arrow Direction */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Arrow Direction</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ARROW_DIRECTIONS.map(dir => {
                    const isActive = arrowDirection === dir;
                    return (
                      <button
                        key={dir}
                        id={`direction-${dir}`}
                        onClick={() => setArrowDirection(dir)}
                        className="py-2 text-xs rounded-lg font-medium transition-all capitalize"
                        style={{
                          background: isActive ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#c4b5fd' : '#64748b',
                          border: isActive
                            ? '1px solid rgba(139,92,246,0.45)'
                            : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        {dir}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2.5">Colors</p>
                <div className="flex flex-col gap-2.5">
                  <ColorRow label="Arrow" value={arrowColor} onChange={setArrowColor} id={`${uid}-arrow-color`} />
                  <ColorRow label="Underline" value={underlineColor} onChange={setUnderlineColor} id={`${uid}-underline-color`} />
                  <ColorRow label="Text" value={textColor} onChange={setTextColor} id={`${uid}-text-color`} />
                </div>
              </div>

              {/* Typography */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2.5">Typography</p>
                <div className="flex flex-col gap-3">
                  {/* Font Size slider */}
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`${uid}-font-size`}
                      className="text-xs text-slate-500 w-20 flex-shrink-0"
                    >
                      Size
                    </label>
                    <input
                      id={`${uid}-font-size`}
                      type="range"
                      min={11}
                      max={28}
                      value={fontSize}
                      onChange={e => setFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono text-slate-400 w-9 text-right flex-shrink-0">
                      {fontSize}px
                    </span>
                  </div>

                  {/* Font Preset */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-20 flex-shrink-0">Family</span>
                    <div className="flex gap-1.5 flex-1">
                      {(Object.keys(FONT_PRESETS) as FontPreset[]).map(p => {
                        const isActive = fontPreset === p;
                        return (
                          <button
                            key={p}
                            id={`font-preset-${p}`}
                            onClick={() => setFontPreset(p)}
                            className="flex-1 py-1.5 text-xs rounded-lg font-medium capitalize transition-all"
                            style={{
                              background: isActive ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.04)',
                              color: isActive ? '#c4b5fd' : '#64748b',
                              border: isActive
                                ? '1px solid rgba(139,92,246,0.45)'
                                : '1px solid rgba(255,255,255,0.07)',
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Style */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-20 flex-shrink-0">Style</span>
                    <div className="flex gap-1.5">
                      {['italic', 'normal'].map(s => {
                        const isActive = fontStyle === s;
                        return (
                          <button
                            key={s}
                            id={`font-style-${s}`}
                            onClick={() => setFontStyle(s)}
                            className="px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all"
                            style={{
                              background: isActive ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.04)',
                              color: isActive ? '#c4b5fd' : '#64748b',
                              border: isActive
                                ? '1px solid rgba(139,92,246,0.45)'
                                : '1px solid rgba(255,255,255,0.07)',
                              fontStyle: s,
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                id="reset-btn"
                onClick={handleReset}
                className="w-full py-2.5 text-xs rounded-lg font-medium transition-all"
                style={{
                  color: '#64748b',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                ↺ Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="text-center py-8 text-xs text-slate-600"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        MIT License ·{' '}
        <a
          href="https://github.com/your-username/doodle-callout"
          className="hover:text-slate-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute on GitHub
        </a>{' '}
        · Built with React + Vite + Tailwind v4
      </footer>
    </div>
  );
}
