import React from 'react';
import Modal from '../ui/Modal';
import { PRESETS, PresetMeta } from '../../blocks/presets/index';
import type { SiteContentV2 } from '../../blocks/types';

// SVG thumbnail per preset
const PREVIEWS: Record<string, React.ReactNode> = {
  blank: (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="160" fill="#f9f9f8" rx="8"/>
      <rect x="24" y="18" width="36" height="6" rx="3" fill="#ccc"/>
      <rect x="68" y="18" width="28" height="6" rx="3" fill="#e0e0e0"/>
      <rect x="104" y="18" width="28" height="6" rx="3" fill="#e0e0e0"/>
      <line x1="24" y1="36" x2="256" y2="36" stroke="#eee" strokeWidth="1"/>
      <rect x="90" y="64" width="100" height="10" rx="5" fill="#ddd"/>
      <rect x="110" y="80" width="60" height="6" rx="3" fill="#eee"/>
      <rect x="115" y="96" width="50" height="14" rx="7" fill="#e0e0e0"/>
      <rect x="24" y="134" width="232" height="1" fill="#eee"/>
      <rect x="100" y="142" width="80" height="5" rx="2" fill="#e5e5e5"/>
    </svg>
  ),
  modern: (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="160" fill="#f0f4ff" rx="8"/>
      <rect x="24" y="16" width="60" height="8" rx="4" fill="#0057ff" fillOpacity=".7"/>
      <rect x="24" y="32" width="200" height="14" rx="4" fill="#111" fillOpacity=".8"/>
      <rect x="24" y="52" width="160" height="8" rx="4" fill="#555" fillOpacity=".5"/>
      <rect x="24" y="68" width="80" height="20" rx="10" fill="#0057ff"/>
      <rect x="112" y="68" width="70" height="20" rx="10" fill="none" stroke="#0057ff" strokeWidth="1.5"/>
      <rect x="24" y="104" width="70" height="40" rx="8" fill="#fff"/>
      <rect x="104" y="104" width="70" height="40" rx="8" fill="#fff"/>
      <rect x="184" y="104" width="70" height="40" rx="8" fill="#fff"/>
      <rect x="36" y="114" width="40" height="6" rx="3" fill="#0057ff" fillOpacity=".6"/>
      <rect x="36" y="126" width="46" height="4" rx="2" fill="#999" fillOpacity=".5"/>
      <rect x="116" y="114" width="40" height="6" rx="3" fill="#0057ff" fillOpacity=".6"/>
      <rect x="116" y="126" width="46" height="4" rx="2" fill="#999" fillOpacity=".5"/>
      <rect x="196" y="114" width="40" height="6" rx="3" fill="#0057ff" fillOpacity=".6"/>
      <rect x="196" y="126" width="46" height="4" rx="2" fill="#999" fillOpacity=".5"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="160" fill="#ffffff" rx="8"/>
      <rect x="24" y="20" width="40" height="6" rx="3" fill="#111" fillOpacity=".8"/>
      <rect x="220" y="18" width="36" height="10" rx="5" fill="#111"/>
      <line x1="24" y1="38" x2="256" y2="38" stroke="#eee" strokeWidth="1"/>
      <rect x="24" y="54" width="50" height="5" rx="2.5" fill="#111" fillOpacity=".3"/>
      <rect x="24" y="66" width="180" height="16" rx="3" fill="#111" fillOpacity=".85"/>
      <rect x="24" y="88" width="220" height="6" rx="3" fill="#555" fillOpacity=".35"/>
      <rect x="24" y="100" width="180" height="6" rx="3" fill="#555" fillOpacity=".25"/>
      <rect x="24" y="118" width="60" height="12" rx="6" fill="#111"/>
      <line x1="24" y1="146" x2="256" y2="146" stroke="#eee" strokeWidth="1"/>
      <rect x="24" y="152" width="100" height="5" rx="2" fill="#ccc"/>
    </svg>
  ),
  bold: (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="160" fill="#0a0a0a" rx="8"/>
      <circle cx="240" cy="40" r="60" fill="#ff3c00" fillOpacity=".12"/>
      <rect x="24" y="18" width="40" height="6" rx="3" fill="#fff" fillOpacity=".7"/>
      <rect x="208" y="16" width="48" height="10" rx="5" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      <rect x="24" y="44" width="220" height="18" rx="3" fill="#fff" fillOpacity=".85"/>
      <rect x="24" y="68" width="160" height="12" rx="3" fill="#ff3c00" fillOpacity=".6"/>
      <rect x="24" y="86" width="120" height="6" rx="3" fill="#fff" fillOpacity=".25"/>
      <rect x="24" y="98" width="60" height="14" rx="6" fill="#ff3c00"/>
      <rect x="92" y="98" width="60" height="14" rx="6" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <rect x="0" y="122" width="280" height="1" fill="rgba(255,255,255,.06)"/>
      <rect x="24" y="130" width="70" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      <rect x="104" y="130" width="70" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      <rect x="184" y="130" width="70" height="22" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      <rect x="32" y="136" width="40" height="4" rx="2" fill="#fff" fillOpacity=".4"/>
      <rect x="112" y="136" width="40" height="4" rx="2" fill="#fff" fillOpacity=".4"/>
      <rect x="192" y="136" width="40" height="4" rx="2" fill="#fff" fillOpacity=".4"/>
    </svg>
  ),
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (presetId: string, slug: string, preset: SiteContentV2) => void;
}

export default function TemplatePickerModal({ isOpen, onClose, onSelect }: Props) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [slug, setSlug] = React.useState('');

  const selectedPreset = PRESETS.find(p => p.id === selectedId) ?? null;

  const handleConfirm = () => {
    if (!selectedPreset || !slug) return;
    onSelect(selectedPreset.id, slug, selectedPreset.preset);
    setSelectedId(null);
    setSlug('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Elige tu plantilla"
      description="Selecciona el diseño base para tu landing page. Podrás personalizarla completamente."
    >
      <style>{`
        .tpl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
        @media (min-width: 560px) { .tpl-grid { grid-template-columns: repeat(4, 1fr); } }
        .tpl-card {
          border: 2px solid var(--border); border-radius: var(--radius);
          cursor: pointer; overflow: hidden; transition: all .2s;
          background: var(--bg);
        }
        .tpl-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,87,255,.12); }
        .tpl-card--active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,87,255,.15); }
        .tpl-thumb { overflow: hidden; }
        .tpl-thumb svg { width: 100%; display: block; }
        .tpl-info { padding: 10px; }
        .tpl-name { font-family: var(--font-display); font-weight: 700; font-size: .8rem; color: var(--text); margin-bottom: 3px; }
        .tpl-desc { font-size: .65rem; color: var(--text-muted); line-height: 1.4; }
        .tpl-slug-wrap { margin-bottom: 24px; }
        .tpl-slug-label { display: block; font-family: var(--font-display); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-secondary); margin-bottom: 8px; }
        .tpl-slug-input { width: 100%; padding: 11px 14px; background: var(--bg-alt); border: 1.5px solid var(--border-strong); border-radius: var(--radius); font-size: .9rem; outline: none; transition: border-color .2s; color: var(--text); box-sizing: border-box; }
        .tpl-slug-input:focus { border-color: var(--accent); }
        .tpl-slug-hint { font-size: .7rem; color: var(--text-muted); margin-top: 6px; }
        .tpl-actions { display: flex; gap: 12px; }
      `}</style>

      <div className="tpl-grid">
        {PRESETS.map((preset) => (
          <div
            key={preset.id}
            className={`tpl-card ${selectedId === preset.id ? 'tpl-card--active' : ''}`}
            onClick={() => setSelectedId(preset.id)}
          >
            <div className="tpl-thumb">{PREVIEWS[preset.id]}</div>
            <div className="tpl-info">
              <div className="tpl-name">{preset.label}</div>
              <div className="tpl-desc">{preset.description}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedPreset && (
        <div className="tpl-slug-wrap">
          <label className="tpl-slug-label">Nombre de tu sitio (URL)</label>
          <input
            type="text"
            className="tpl-slug-input"
            placeholder="mi-landing"
            value={slug}
            onChange={(e) => {
              const val = e.target.value.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
              setSlug(val);
            }}
          />
          {slug && (
            <p className="tpl-slug-hint">
              Tu sitio: <strong style={{ color: 'var(--accent)' }}>{slug}.landit.now</strong>
            </p>
          )}
        </div>
      )}

      <div className="tpl-actions">
        <button
          onClick={onClose}
          style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border-strong)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.875rem' }}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedPreset || !slug}
          style={{
            flex: 2, padding: '12px', borderRadius: 'var(--radius-full)', border: 'none',
            background: selectedPreset && slug ? 'var(--accent)' : 'var(--border)',
            color: selectedPreset && slug ? '#fff' : 'var(--text-muted)',
            cursor: selectedPreset && slug ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.875rem',
            transition: 'background .2s',
          }}
        >
          Usar esta plantilla →
        </button>
      </div>
    </Modal>
  );
}
