interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  description?: string;
}

export default function TextAreaField({ label, value, onChange, rows = 3, description }: TextAreaFieldProps) {
  return (
    <div className="ctrl-wrap">
      <style>{`
        .ctrl-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-textarea { width: 100%; padding: 8px 10px; background: var(--bg); border: 1.5px solid var(--border-strong, rgba(0,0,0,.14)); border-radius: 8px; font-size: .82rem; font-family: var(--font-body); color: var(--text); outline: none; transition: border-color .15s; resize: vertical; box-sizing: border-box; }
        .ctrl-textarea:focus { border-color: var(--accent); }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <textarea
        className="ctrl-textarea"
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
