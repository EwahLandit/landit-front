import { useEffect } from 'react';
import { CURATED_FONTS, buildFontLink } from './fonts';

interface FontFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}

let injected = false;
function ensureAllFontsLoaded() {
  if (injected) return;
  injected = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = buildFontLink(CURATED_FONTS.map(f => f.value));
  link.dataset.landitFonts = 'preview';
  document.head.appendChild(link);
}

export default function FontField({ label, value, onChange, description }: FontFieldProps) {
  useEffect(() => { ensureAllFontsLoaded(); }, []);

  return (
    <div className="ctrl-font-wrap">
      <style>{`
        .ctrl-font-wrap { margin-bottom: 14px; }
        .ctrl-font-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .ctrl-font-opt { padding: 10px 12px; border: 1.5px solid var(--border-strong); background: var(--bg); border-radius: 10px; cursor: pointer; transition: all .15s var(--ease-out); text-align: left; font-size: 1rem; color: var(--text); }
        .ctrl-font-opt:hover { border-color: var(--accent); background: var(--accent-subtle); }
        .ctrl-font-opt.active { border-color: var(--accent); background: var(--accent-subtle); box-shadow: var(--shadow-sm); }
        .ctrl-font-opt-name { display: block; font-size: .62rem; color: var(--text-muted); font-family: var(--font-display); letter-spacing: .06em; text-transform: uppercase; margin-top: 4px; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="ctrl-font-grid">
        {CURATED_FONTS.map(f => (
          <button
            key={f.value}
            type="button"
            className={`ctrl-font-opt${value === f.value ? ' active' : ''}`}
            style={{ fontFamily: f.stack, fontWeight: 600 }}
            onClick={() => onChange(f.value)}
          >
            {f.label}
            <span className="ctrl-font-opt-name">{f.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
