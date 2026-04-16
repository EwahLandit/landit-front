interface SelectOption { value: string; label: string; }

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  description?: string;
}

export default function SelectField({ label, value, onChange, options, description }: SelectFieldProps) {
  return (
    <div className="ctrl-wrap">
      <style>{`
        .ctrl-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-select { width: 100%; padding: 8px 10px; background: var(--bg); border: 1.5px solid var(--border-strong, rgba(0,0,0,.14)); border-radius: 8px; font-size: .82rem; font-family: var(--font-body); color: var(--text); outline: none; transition: border-color .15s; appearance: none; cursor: pointer; box-sizing: border-box; }
        .ctrl-select:focus { border-color: var(--accent); }
        .ctrl-select-wrap { position: relative; }
        .ctrl-select-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="ctrl-select-wrap">
        <select
          className="ctrl-select"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="ctrl-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
