import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface TextImageConfig { image_side: 'left' | 'right'; image_url: string; title: string; text: string; cta_label: string; cta_url: string; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<TextImageConfig> = {
  type: 'text_image',
  category: 'content',
  label: 'Texto + Imagen',
  description: 'Sección dividida con texto a un lado e imagen al otro.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h8M3 13h8M3 17h5M13 6h8v12h-8z"/></svg>,
  defaultConfig: { image_side: 'right', image_url: '', title: '¿Por qué elegirnos?', text: 'Somos el equipo detrás de la solución que tu negocio necesita.', cta_label: 'Saber más', cta_url: '', bg_color: '', text_color: '', spacing: { top: 64, bottom: 64 } },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'text', label: 'Texto', kind: 'richtext', section: 'Contenido' },
    { key: 'image_url', label: 'Imagen', kind: 'image', section: 'Contenido' },
    { key: 'cta_label', label: 'Texto del botón', kind: 'text', section: 'Botones' },
    { key: 'cta_url', label: 'URL del botón', kind: 'url', section: 'Botones' },
    { key: 'image_side', label: 'Lado de la imagen', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'right', label: 'Derecha' }], section: 'Estilo' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    const imgLeft = config.image_side === 'left';
    const row = isMobile ? 'column' : (imgLeft ? 'row' : 'row-reverse');
    const tc = config.text_color || 'var(--text)';
    const tcs = config.text_color || 'var(--text-secondary)';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 20 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        <div style={{ display: 'flex', flexDirection: row as never, gap: isMobile ? 32 : 64, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {config.image_url
              ? <img src={config.image_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg, 20px)', objectFit: 'cover', display: 'block', maxHeight: 420 }} />
              : <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--border, rgba(0,0,0,.06))', borderRadius: 'var(--radius-lg, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted,#999)', fontSize: '.8rem' }}>Imagen</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isMobile ? '1.8rem' : '2rem', color: tc, margin: '0 0 16px', lineHeight: 1.1 }}>{config.title}</h2>}
            {config.text && <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: tcs, lineHeight: 1.7, margin: '0 0 28px' }}>{config.text}</p>}
            {config.cta_label && <a href={config.cta_url || '#'} style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}>{config.cta_label}</a>}
          </div>
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
