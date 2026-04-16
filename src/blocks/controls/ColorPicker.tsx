import { useState, useEffect, useRef } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}

const FAV_KEY = 'landit-fav-colors';

function loadFavs(): string[] {
  try { const raw = localStorage.getItem(FAV_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveFavs(favs: string[]): void {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {}
}

export default function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [favs, setFavs] = useState<string[]>(() => loadFavs());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: StorageEvent) => { if (e.key === FAV_KEY) setFavs(loadFavs()); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  function star() {
    if (!value || favs.includes(value)) return;
    const next = [value, ...favs].slice(0, 10);
    setFavs(next); saveFavs(next);
  }
  function removeFav(c: string) {
    const next = favs.filter(f => f !== c);
    setFavs(next); saveFavs(next);
  }
  const isStarred = !!(value && favs.includes(value));

  return (
    <div className="cp-wrap">
      <style>{`
        .cp-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 6px; line-height: 1.4; }

        /* card container */
        .cp-card {
          background: var(--bg);
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.14));
          border-radius: var(--radius, 12px);
          overflow: hidden;
          transition: border-color .15s;
        }
        .cp-card:focus-within { border-color: var(--accent); }

        /* main row */
        .cp-row {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 8px;
        }

        /* color swatch trigger */
        .cp-swatch {
          width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
          border: 1.5px solid rgba(0,0,0,.12);
          cursor: pointer; position: relative; overflow: hidden; padding: 0;
          transition: transform .15s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)),
                      box-shadow .15s;
        }
        .cp-swatch:hover { transform: scale(1.08); box-shadow: 0 3px 10px rgba(0,0,0,.18); }
        .cp-swatch-native {
          position: absolute; inset: -4px; opacity: 0;
          cursor: pointer; border: none; padding: 0; width: calc(100% + 8px); height: calc(100% + 8px);
        }

        /* hex input */
        .cp-hex {
          flex: 1; min-width: 0;
          background: none; border: none; outline: none;
          font-size: .82rem; font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          color: var(--text); padding: 4px 4px;
          letter-spacing: .02em;
        }
        .cp-hex::placeholder { color: var(--text-muted); }

        /* star button */
        .cp-star {
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; flex-shrink: 0;
          color: var(--text-muted); border-radius: 7px;
          transition: color .12s, background .12s, transform .15s var(--ease-spring);
          padding: 0;
        }
        .cp-star:hover { color: #f59e0b; background: rgba(245,158,11,.1); transform: scale(1.1); }
        .cp-star.on { color: #f59e0b; }
        .cp-star.on:hover { color: #d97706; }

        /* clear button */
        .cp-clear {
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; flex-shrink: 0;
          color: var(--text-muted); border-radius: 6px;
          transition: color .12s, background .12s;
          font-size: .75rem; padding: 0;
        }
        .cp-clear:hover { color: var(--danger, #e53935); background: rgba(229,57,53,.08); }

        /* favorites section */
        .cp-favs-section {
          border-top: 1px solid var(--border, rgba(0,0,0,.07));
          padding: 7px 10px 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .cp-favs-lbl {
          font-size: .58rem; font-family: var(--font-display); font-weight: 700;
          letter-spacing: .07em; text-transform: uppercase;
          color: var(--text-muted); flex-shrink: 0; line-height: 1;
        }
        .cp-favs {
          display: flex; flex-wrap: wrap; gap: 5px; flex: 1;
        }
        .cp-fav {
          width: 18px; height: 18px; border-radius: 50%;
          border: 1.5px solid transparent;
          cursor: pointer; padding: 0; flex-shrink: 0;
          transition: transform .12s var(--ease-spring), box-shadow .12s;
          box-sizing: border-box;
        }
        .cp-fav:hover { transform: scale(1.25); box-shadow: 0 0 0 3px rgba(0,87,255,.15); }
        .cp-fav.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-glow, rgba(0,87,255,.2));
        }
      `}</style>

      {label && <label className="ctrl-label">{label}</label>}
      {description && <p className="ctrl-desc">{description}</p>}

      <div className="cp-card">
        <div className="cp-row">
          {/* Swatch / native picker trigger */}
          <button
            type="button"
            className="cp-swatch"
            style={{ background: value || 'linear-gradient(135deg, #e5e5e5 50%, #ccc 50%)' }}
            onClick={() => inputRef.current?.click()}
            title="Abrir selector de color"
          >
            <input
              ref={inputRef}
              type="color"
              className="cp-swatch-native"
              value={value || '#000000'}
              onChange={e => onChange(e.target.value)}
            />
          </button>

          {/* Hex text input */}
          <input
            type="text"
            className="cp-hex"
            value={value}
            onChange={e => {
              const v = e.target.value;
              if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) {
                onChange(v.startsWith('#') || v === '' ? v : '#' + v);
              }
            }}
            maxLength={7}
            spellCheck={false}
            placeholder="#000000"
          />

          {/* Star / save button */}
          <button
            type="button"
            className={`cp-star${isStarred ? ' on' : ''}`}
            title={isStarred ? 'Color guardado' : 'Guardar color'}
            onClick={star}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>

          {/* Clear button */}
          {value && (
            <button
              type="button"
              className="cp-clear"
              title="Limpiar color"
              onClick={() => onChange('')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Saved favorites */}
        {favs.length > 0 && (
          <div className="cp-favs-section">
            <span className="cp-favs-lbl">Guardados</span>
            <div className="cp-favs">
              {favs.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`cp-fav${value === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  title={`${c} · clic derecho para quitar`}
                  onClick={() => onChange(c)}
                  onContextMenu={e => { e.preventDefault(); removeFav(c); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
