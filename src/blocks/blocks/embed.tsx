import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface EmbedConfig { url: string; height: number; title: string; aspect_ratio: 'free' | '16x9' | '4x3' | '1x1' | '21x9'; allow_fullscreen: boolean; spacing: { top: number; bottom: number }; }

function sanitizeEmbed(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const allowed = ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com', 'maps.google.com', 'www.google.com', 'calendly.com', 'typeform.com', 'airtable.com', 'notion.so'];
    if (allowed.some(h => u.hostname === h || u.hostname.endsWith('.' + h))) return url;
    return null;
  } catch { return null; }
}

const def: BlockDefinition<EmbedConfig> = {
  type: 'embed',
  category: 'utility',
  label: 'Embed / Iframe',
  description: 'Incrusta contenido externo (Maps, Calendly, Typeform, etc.).',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  defaultConfig: { url: '', height: 480, title: '', aspect_ratio: '16x9', allow_fullscreen: true, spacing: { top: 32, bottom: 32 } },
  schema: [
    { key: 'url', label: 'URL a incrustar', kind: 'url', description: 'Dominios permitidos: YouTube, Vimeo, Google Maps, Calendly, Typeform, Airtable, Notion.', section: 'Contenido' },
    { key: 'title', label: 'Título (opcional)', kind: 'text', section: 'Contenido' },
    { key: 'aspect_ratio', label: 'Relación de aspecto', kind: 'select', options: [{ value: 'free', label: 'Libre (usa altura fija)' }, { value: '16x9', label: '16:9' }, { value: '4x3', label: '4:3' }, { value: '1x1', label: '1:1' }, { value: '21x9', label: '21:9' }], section: 'Visualización' },
    { key: 'height', label: 'Altura (px) — solo en modo libre', kind: 'number', min: 100, max: 1200, section: 'Visualización' },
    { key: 'allow_fullscreen', label: 'Permitir pantalla completa', kind: 'toggle', section: 'Visualización' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config }) => {
    const safe = sanitizeEmbed(config.url);
    const ratioMap: Record<string, string> = { '16x9': '56.25%', '4x3': '75%', '1x1': '100%', '21x9': '42.86%' };
    const ratio = config.aspect_ratio && config.aspect_ratio !== 'free' ? ratioMap[config.aspect_ratio] : null;
    return (
      <div style={{ padding: `${config.spacing?.top ?? 32}px 40px ${config.spacing?.bottom ?? 32}px` }}>
        {config.title && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: 16, textAlign: 'center' }}>{config.title}</h3>}
        {safe
          ? ratio
            ? <div style={{ position: 'relative', paddingBottom: ratio, borderRadius: 12, overflow: 'hidden' }}>
                <iframe src={safe} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} title={config.title || 'embed'} allowFullScreen={config.allow_fullscreen !== false} />
              </div>
            : <iframe src={safe} style={{ width: '100%', height: config.height || 480, border: 'none', borderRadius: 12, display: 'block' }} title={config.title || 'embed'} allowFullScreen={config.allow_fullscreen !== false} />
          : <div style={{ height: config.height || 480, background: 'var(--border,rgba(0,0,0,.06))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted,#999)', fontSize: '.85rem', flexDirection: 'column', gap: 8 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: .4 }}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              {config.url ? 'URL no permitida' : 'Ingresa una URL para incrustar'}
            </div>
        }
      </div>
    );
  },
};
registerBlock(def);
export default def;
