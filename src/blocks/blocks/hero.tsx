import { registerBlock } from '../registry';
import type { BlockDefinition, Viewport } from '../types';

interface HeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  alignment: 'left' | 'center' | 'right';
  media_type: 'none' | 'image' | 'video';
  media_url: string;
  overlay_opacity: number;
  min_height: string;
  bg_color: string;
  text_color: string;
  spacing: { top: number; bottom: number };
}

function HeroComponent({ config, viewport }: { config: HeroConfig; mobileConfig?: Partial<HeroConfig>; viewport: Viewport; blockId: string }) {
  const isMobile = viewport === 'mobile';
  const align = config.alignment ?? 'center';
  const hasMedia = config.media_type !== 'none' && config.media_url;

  return (
    <section style={{
      position: 'relative',
      minHeight: config.min_height || '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      background: hasMedia ? 'transparent' : (config.bg_color || 'var(--bg)'),
      paddingTop: config.spacing?.top ?? 80,
      paddingBottom: config.spacing?.bottom ?? 80,
      paddingLeft: isMobile ? 20 : 80,
      paddingRight: isMobile ? 20 : 80,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <style>{`
        .hero-eyebrow { font-size: .78rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; opacity: .7; margin-bottom: 12px; }
        .hero-title { font-size: ${isMobile ? '2rem' : '3.2rem'}; font-family: var(--font-display); font-weight: 800; line-height: 1.08; margin: 0 0 16px; }
        .hero-subtitle { font-size: ${isMobile ? '.95rem' : '1.1rem'}; font-family: var(--font-body); opacity: .75; line-height: 1.6; margin: 0 0 36px; max-width: 600px; }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: ${align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'}; }
        .hero-btn-primary { padding: 14px 28px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius-full, 9999px); font-family: var(--font-display); font-weight: 700; font-size: .9rem; cursor: pointer; text-decoration: none; display: inline-block; }
        .hero-btn-secondary { padding: 13px 28px; background: transparent; color: inherit; border: 1.5px solid currentColor; border-radius: var(--radius-full, 9999px); font-family: var(--font-display); font-weight: 600; font-size: .9rem; cursor: pointer; text-decoration: none; display: inline-block; opacity: .8; }
      `}</style>

      {hasMedia && config.media_type === 'image' && (
        <img src={config.media_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}
      {hasMedia && config.media_type === 'video' && (
        <video src={config.media_url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}
      {hasMedia && config.overlay_opacity > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: config.overlay_opacity / 100, zIndex: 1 }} />
      )}

      <div style={{ position: 'relative', zIndex: 2, textAlign: align, color: config.text_color || 'var(--text)', maxWidth: isMobile ? '100%' : 800, width: '100%' }}>
        {config.eyebrow && <p className="hero-eyebrow">{config.eyebrow}</p>}
        {config.title && <h1 className="hero-title">{config.title}</h1>}
        {config.subtitle && <p className="hero-subtitle">{config.subtitle}</p>}
        <div className="hero-ctas">
          {config.primary_cta_label && <a href={config.primary_cta_url || '#'} className="hero-btn-primary">{config.primary_cta_label}</a>}
          {config.secondary_cta_label && <a href={config.secondary_cta_url || '#'} className="hero-btn-secondary">{config.secondary_cta_label}</a>}
        </div>
      </div>
    </section>
  );
}

const heroDef: BlockDefinition<HeroConfig> = {
  type: 'hero',
  category: 'content',
  label: 'Hero',
  description: 'Sección principal con título, subtítulo, botones de acción y fondo multimedia opcional.',
  icon: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  defaultConfig: {
    eyebrow: '',
    title: 'Tu título principal aquí',
    subtitle: 'Una descripción breve y convincente de tu propuesta de valor.',
    primary_cta_label: 'Comenzar ahora',
    primary_cta_url: '',
    secondary_cta_label: 'Saber más',
    secondary_cta_url: '',
    alignment: 'center',
    media_type: 'none',
    media_url: '',
    overlay_opacity: 0,
    min_height: '80vh',
    bg_color: '',
    text_color: '',
    spacing: { top: 80, bottom: 80 },
  },
  schema: [
    { key: 'eyebrow', label: 'Texto superior (eyebrow)', kind: 'text', placeholder: 'Novedad · Característica', section: 'Contenido' },
    { key: 'title', label: 'Título principal', kind: 'text', section: 'Contenido' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'textarea', rows: 3, section: 'Contenido' },
    { key: 'primary_cta_label', label: 'Botón principal — texto', kind: 'text', section: 'Botones' },
    { key: 'primary_cta_url', label: 'Botón principal — URL', kind: 'url', section: 'Botones' },
    { key: 'secondary_cta_label', label: 'Botón secundario — texto', kind: 'text', section: 'Botones' },
    { key: 'secondary_cta_url', label: 'Botón secundario — URL', kind: 'url', section: 'Botones' },
    { key: 'media_type', label: 'Tipo de fondo multimedia', kind: 'select', options: [{ value: 'none', label: 'Ninguno' }, { value: 'image', label: 'Imagen' }, { value: 'video', label: 'Video' }], section: 'Multimedia de fondo' },
    { key: 'media_url', label: 'URL multimedia', kind: 'url', description: 'URL de imagen o video de fondo.', section: 'Multimedia de fondo' },
    { key: 'overlay_opacity', label: 'Opacidad del overlay (%)', kind: 'number', min: 0, max: 100, step: 5, section: 'Multimedia de fondo' },
    { key: 'alignment', label: 'Alineación', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }], section: 'Estilo' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'min_height', label: 'Altura mínima', kind: 'text', placeholder: '80vh', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: HeroComponent,
};

registerBlock(heroDef);

export default heroDef;
