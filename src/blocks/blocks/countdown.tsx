import { useEffect, useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface CountdownConfig { target: string; title: string; timezone: string; show_labels: boolean; post_action: 'hide' | 'text' | 'redirect'; post_text: string; post_url: string; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

function pad(n: number) { return String(n).padStart(2, '0'); }

function CountdownComponent({ config }: { config: CountdownConfig; viewport: string; blockId: string; mobileConfig?: unknown }) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    function update() { setDiff(Math.max(0, new Date(config.target).getTime() - Date.now())); }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [config.target]);

  const expired = diff === 0;
  if (expired && config.post_action === 'hide') return null;
  if (expired && config.post_action === 'redirect' && config.post_url) {
    window.location.href = config.post_url;
    return null;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <section style={{ background: config.bg_color || 'var(--accent)', color: config.text_color || '#fff', padding: `${config.spacing?.top ?? 48}px 40px ${config.spacing?.bottom ?? 48}px`, textAlign: 'center' }}>
      {config.title && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 24, opacity: .9 }}>{config.title}</h3>}
      {expired ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}>{config.post_text || 'Tiempo agotado'}</p>
      ) : (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end' }}>
          {[{ v: d, l: 'días' }, { v: h, l: 'horas' }, { v: m, l: 'min' }, { v: s, l: 'seg' }].map(({ v, l }) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', lineHeight: 1, background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '8px 16px', minWidth: 64 }}>{pad(v)}</div>
              {config.show_labels !== false && <div style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', opacity: .7, textTransform: 'uppercase', letterSpacing: '.06em' }}>{l}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const def: BlockDefinition<CountdownConfig> = {
  type: 'countdown',
  category: 'commerce',
  label: 'Cuenta regresiva',
  description: 'Temporizador hasta una fecha objetivo con acción post-expiración.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  defaultConfig: { target: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16), title: '¡La oferta termina en!', timezone: 'local', show_labels: true, post_action: 'text', post_text: '¡Tiempo agotado!', post_url: '', bg_color: '', text_color: '', spacing: { top: 48, bottom: 48 } },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'target', label: 'Fecha objetivo', kind: 'text', placeholder: 'YYYY-MM-DDTHH:MM', section: 'Contenido' },
    { key: 'timezone', label: 'Zona horaria', kind: 'select', options: [{ value: 'local', label: 'Local del visitante' }, { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (BUE)' }, { value: 'America/Mexico_City', label: 'México (CDMX)' }, { value: 'America/Santiago', label: 'Chile (SCL)' }, { value: 'America/Bogota', label: 'Colombia (BOG)' }, { value: 'America/Lima', label: 'Perú (LIM)' }, { value: 'UTC', label: 'UTC' }], section: 'Contenido' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'show_labels', label: 'Mostrar etiquetas (días, horas…)', kind: 'toggle', section: 'Estilo' },
    { key: 'post_action', label: 'Acción al expirar', kind: 'select', options: [{ value: 'hide', label: 'Ocultar bloque' }, { value: 'text', label: 'Mostrar mensaje' }, { value: 'redirect', label: 'Redirigir' }], section: 'Al expirar' },
    { key: 'post_text', label: 'Mensaje de expiración', kind: 'text', section: 'Al expirar' },
    { key: 'post_url', label: 'URL de redirección', kind: 'url', section: 'Al expirar' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: CountdownComponent as BlockDefinition<CountdownConfig>['Component'],
};
registerBlock(def);
export default def;
