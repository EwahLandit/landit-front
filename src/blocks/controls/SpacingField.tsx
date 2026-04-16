interface SpacingValue {
  top: number;
  bottom: number;
}

interface SpacingFieldProps {
  label: string;
  value: SpacingValue;
  onChange: (v: SpacingValue) => void;
  description?: string;
}

const STEP = 4;
const MIN = 0;
const MAX = 400;

function clamp(v: number) { return Math.max(MIN, Math.min(MAX, v)); }

function Stepper({ sublabel, value, onChange }: { sublabel: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="spc-cell">
      <span className="spc-sublabel">{sublabel}</span>
      <div className="spc-stepper">
        <button
          type="button"
          className="spc-btn"
          onClick={() => onChange(clamp(value - STEP))}
          aria-label={`Reducir ${sublabel}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <input
          type="number"
          className="spc-input"
          value={value}
          min={MIN}
          max={MAX}
          onChange={e => onChange(clamp(Number(e.target.value) || 0))}
          aria-label={sublabel}
        />
        <button
          type="button"
          className="spc-btn"
          onClick={() => onChange(clamp(value + STEP))}
          aria-label={`Aumentar ${sublabel}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SpacingField({ label, value, onChange, description }: SpacingFieldProps) {
  const v = value ?? { top: 0, bottom: 0 };
  return (
    <div className="ctrl-spacing-wrap">
      <style>{`
        .ctrl-spacing-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 6px; line-height: 1.4; }

        .spc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

        .spc-cell { display: flex; flex-direction: column; gap: 4px; }
        .spc-sublabel {
          font-size: .62rem; font-family: var(--font-display); font-weight: 600;
          letter-spacing: .04em; color: var(--text-muted); line-height: 1;
        }

        .spc-stepper {
          display: flex; align-items: center;
          background: var(--bg);
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.14));
          border-radius: var(--radius-full, 9999px);
          overflow: hidden;
          transition: border-color .15s;
          height: 32px;
        }
        .spc-stepper:focus-within { border-color: var(--accent); }

        .spc-btn {
          width: 30px; height: 100%; display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; flex-shrink: 0;
          color: var(--text-muted);
          transition: color .12s, background .12s;
        }
        .spc-btn:hover { color: var(--accent); background: var(--accent-subtle, rgba(0,87,255,.06)); }
        .spc-btn:active { background: var(--accent-subtle, rgba(0,87,255,.1)); }

        .spc-input {
          flex: 1; min-width: 0; text-align: center;
          background: none; border: none; outline: none;
          font-size: .82rem; font-family: var(--font-display); font-weight: 600;
          color: var(--text); padding: 0;
          -moz-appearance: textfield;
        }
        .spc-input::-webkit-inner-spin-button,
        .spc-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="spc-row">
        <Stepper sublabel="Superior" value={v.top} onChange={val => onChange({ ...v, top: val })} />
        <Stepper sublabel="Inferior" value={v.bottom} onChange={val => onChange({ ...v, bottom: val })} />
      </div>
    </div>
  );
}
