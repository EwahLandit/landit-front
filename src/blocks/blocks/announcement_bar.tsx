import { useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface Message { text: string; url: string; }
interface AnnouncementBarConfig {
  bg_color: string;
  text_color: string;
  animation: 'none' | 'ltr' | 'pulse';
  messages: Message[];
  countdown_enabled: boolean;
  countdown_target: string;
  dismissible: boolean;
  sticky: boolean;
}

function AnnouncementBarComponent({ config }: { config: AnnouncementBarConfig; viewport: string; blockId: string; mobileConfig?: unknown }) {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(() => config.dismissible && sessionStorage.getItem('ann-dismissed') === '1');
  const msgs = (config.messages ?? []).filter(m => m.text.trim());
  if (!msgs.length || dismissed) return null;

  let countdown = '';
  if (config.countdown_enabled && config.countdown_target) {
    const diff = Math.max(0, new Date(config.countdown_target).getTime() - Date.now());
    if (diff > 0) {
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      countdown = `${d > 0 ? d + 'd ' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  }

  const msg = msgs[idx % msgs.length];

  function dismiss() { sessionStorage.setItem('ann-dismissed', '1'); setDismissed(true); }

  return (
    <div style={{ background: config.bg_color || '#0057ff', color: config.text_color || '#fff', width: '100%', padding: '9px 20px', textAlign: 'center', fontSize: '.83rem', fontFamily: 'var(--font-body)', overflow: 'hidden', animation: config.animation === 'pulse' ? 'ann-pulse 2s ease-in-out infinite' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, position: config.sticky !== false ? 'sticky' : 'relative', top: 0, zIndex: 10 }}>
      <style>{`@keyframes ann-pulse{0%,100%{opacity:1}50%{opacity:.5}} @keyframes ann-ltr{from{transform:translateX(100%)}to{transform:translateX(-100%)}}`}</style>
      {config.animation === 'ltr' ? (
        <span style={{ display: 'inline-block', animation: 'ann-ltr 18s linear infinite', whiteSpace: 'nowrap' }}>
          {msgs.map((m, i) => (
            <span key={i}>
              {m.url ? <a href={m.url} style={{ color: 'inherit', textDecoration: 'underline' }}>{m.text}</a> : m.text}
              {i < msgs.length - 1 && <span style={{ margin: '0 40px' }}>·</span>}
            </span>
          ))}
        </span>
      ) : (
        <>
          {msg.url ? <a href={msg.url} style={{ color: 'inherit', textDecoration: 'underline' }}>{msg.text}</a> : <span>{msg.text}</span>}
          {countdown && <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '.88rem', opacity: .9 }}>{countdown}</span>}
          {msgs.length > 1 && (
            <button type="button" onClick={() => setIdx(i => i + 1)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem', opacity: .8, padding: 0, lineHeight: 1 }}>›</button>
          )}
        </>
      )}
      {config.dismissible && (
        <button type="button" onClick={dismiss} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: .7, padding: '0 0 0 8px', lineHeight: 1, fontSize: '1rem', flexShrink: 0 }} aria-label="Cerrar">×</button>
      )}
    </div>
  );
}

const def: BlockDefinition<AnnouncementBarConfig> = {
  type: 'announcement_bar',
  category: 'layout',
  label: 'Barra de anuncio',
  description: 'Franja fija de ancho completo con mensajes y cuenta regresiva opcional.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M3 8l9-5 9 5"/></svg>,
  defaultConfig: { bg_color: '#0057ff', text_color: '#ffffff', animation: 'none', messages: [{ text: '¡Bienvenido! Descuento del 10% con el código WELCOME', url: '' }], countdown_enabled: false, countdown_target: '', dismissible: false, sticky: true },
  schema: [
    { key: 'messages', label: 'Mensajes', kind: 'repeater', maxItems: 3, fields: [{ key: 'text', label: 'Texto', kind: 'text' }, { key: 'url', label: 'Enlace (opcional)', kind: 'url' }], addLabel: 'Agregar mensaje', section: 'Contenido' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'animation', label: 'Animación', kind: 'select', options: [{ value: 'none', label: 'Ninguna' }, { value: 'ltr', label: 'Desplazamiento' }, { value: 'pulse', label: 'Pulsante' }], section: 'Estilo' },
    { key: 'countdown_enabled', label: 'Mostrar cuenta regresiva', kind: 'toggle', section: 'Cuenta regresiva' },
    { key: 'countdown_target', label: 'Fecha objetivo (ISO)', kind: 'text', placeholder: '2026-12-31T23:59:00', description: 'Formato: YYYY-MM-DDTHH:MM:SS', section: 'Cuenta regresiva' },
    { key: 'sticky', label: 'Fijar al hacer scroll', kind: 'toggle', section: 'Avanzado' },
    { key: 'dismissible', label: 'Permitir cerrar (×)', kind: 'toggle', section: 'Avanzado' },
  ],
  Component: AnnouncementBarComponent as BlockDefinition<AnnouncementBarConfig>['Component'],
};
registerBlock(def);
export default def;
