interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export default function NumberField({ label, value, onChange, min = 0, max = 9999, step = 1, description }: NumberFieldProps) {
  function clamp(v: number) {
    return Math.max(min ?? 0, Math.min(max ?? 9999, v));
  }

  return (
    <div className="ctrl-num-wrap">
      <style>{`
        .ctrl-num-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 6px; line-height: 1.4; }

        .num-stepper {
          display: flex; align-items: center;
          background: var(--bg);
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.14));
          border-radius: var(--radius-full, 9999px);
          overflow: hidden;
          transition: border-color .15s;
          height: 36px;
        }
        .num-stepper:focus-within { border-color: var(--accent); }

        .num-btn {
          width: 36px; height: 100%; display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; flex-shrink: 0;
          color: var(--text-muted);
          transition: color .12s, background .12s;
        }
        .num-btn:hover { color: var(--accent); background: var(--accent-subtle, rgba(0,87,255,.06)); }
        .num-btn:active { background: var(--accent-subtle, rgba(0,87,255,.1)); }

        .num-input {
          flex: 1; min-width: 0; text-align: center;
          background: none; border: none; outline: none;
          font-size: .88rem; font-family: var(--font-display); font-weight: 600;
          color: var(--text); padding: 0;
          -moz-appearance: textfield;
        }
        .num-input::-webkit-inner-spin-button,
        .num-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="num-stepper">
        <button
          type="button"
          className="num-btn"
          onClick={() => onChange(clamp(value - step))}
          aria-label="Reducir"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <input
          type="number"
          className="num-input"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(clamp(Number(e.target.value) || 0))}
        />
        <button
          type="button"
          className="num-btn"
          onClick={() => onChange(clamp(value + step))}
          aria-label="Aumentar"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
