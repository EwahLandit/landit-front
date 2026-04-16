interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}

export default function ToggleField({ label, value, onChange, description }: ToggleFieldProps) {
  return (
    <div className="ctrl-toggle-wrap">
      <style>{`
        .ctrl-toggle-wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .ctrl-toggle-labels { flex: 1; min-width: 0; }
        .ctrl-toggle-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); }
        .ctrl-toggle-desc { font-size: .7rem; color: var(--text-muted, #999); line-height: 1.4; margin-top: 2px; }
        .ctrl-toggle-btn { position: relative; width: 36px; height: 20px; flex-shrink: 0; border: none; border-radius: 9999px; cursor: pointer; transition: background .2s; background: var(--toggle-bg, rgba(0,0,0,.15)); }
        .ctrl-toggle-btn.on { background: var(--accent); }
        .ctrl-toggle-knob { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; }
        .ctrl-toggle-btn.on .ctrl-toggle-knob { transform: translateX(16px); }
      `}</style>
      <div className="ctrl-toggle-labels">
        <span className="ctrl-toggle-label">{label}</span>
        {description && <span className="ctrl-toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        className={`ctrl-toggle-btn${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <span className="ctrl-toggle-knob" />
      </button>
    </div>
  );
}
