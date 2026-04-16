interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  description?: string;
}

export default function TextField({ label, value, onChange, placeholder, description }: TextFieldProps) {
  return (
    <div className="ctrl-wrap">
      <style>{`
        .ctrl-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-input { width: 100%; padding: 8px 10px; background: var(--bg); border: 1.5px solid var(--border-strong, rgba(0,0,0,.14)); border-radius: 8px; font-size: .82rem; font-family: var(--font-body); color: var(--text); outline: none; transition: border-color .15s; box-sizing: border-box; }
        .ctrl-input:focus { border-color: var(--accent); }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <input
        type="text"
        className="ctrl-input"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
