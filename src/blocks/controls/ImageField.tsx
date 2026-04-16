import { useRef } from 'react';
import { apiUploadAsset } from '../../lib/api';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  websiteId: number;
  recommendedSize?: string;
  description?: string;
}

export default function ImageField({ label, value, onChange, websiteId, recommendedSize, description }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const result = await apiUploadAsset(websiteId, file);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    onChange(result.url);
  }

  return (
    <div className="ctrl-img-wrap">
      <style>{`
        .ctrl-img-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-img-drop { border: 1.5px dashed var(--border-strong, rgba(0,0,0,.14)); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: border-color .15s, background .15s; }
        .ctrl-img-drop:hover { border-color: var(--accent); background: var(--accent-subtle, #e8f0ff); }
        .ctrl-img-preview { width: 100%; max-height: 100px; object-fit: contain; border-radius: 6px; }
        .ctrl-img-placeholder { font-size: .75rem; color: var(--text-muted, #999); text-align: center; }
        .ctrl-img-hint { font-size: .68rem; color: var(--text-muted, #999); }
        .ctrl-img-clear { margin-top: 4px; font-size: .7rem; color: var(--accent); background: none; border: none; cursor: pointer; padding: 0; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      {recommendedSize && <p className="ctrl-desc">Tamaño recomendado: {recommendedSize}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
      <div
        className="ctrl-img-drop"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
      >
        {value ? (
          <img src={value} className="ctrl-img-preview" alt="preview" />
        ) : (
          <span className="ctrl-img-placeholder">Hacer clic o arrastrar imagen aquí</span>
        )}
        <span className="ctrl-img-hint">PNG, JPG, WebP, SVG · Máx. 5 MB</span>
      </div>
      {value && (
        <button className="ctrl-img-clear" type="button" onClick={() => onChange('')}>
          Quitar imagen
        </button>
      )}
    </div>
  );
}
