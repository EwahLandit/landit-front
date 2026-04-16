import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface CTABannerConfig { title: string; description: string; alignment: 'left' | 'center' | 'right'; primary_cta_label: string; primary_cta_url: string; secondary_cta_label: string; secondary_cta_url: string; cta_style: 'solid' | 'outline' | 'ghost'; bg_color: string; text_color: string; bg_image_url: string; overlay_opacity: number; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<CTABannerConfig> = {
  type: 'cta_banner',
  category: 'content',
  label: 'Llamada a la acción',
  description: 'Banner destacado con título, descripción y botones de acción.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16.92z"/></svg>,
  defaultConfig: { title: '¿Listo para empezar?', description: 'Únete a cientos de clientes que ya están creciendo con nosotros.', alignment: 'center', primary_cta_label: 'Empezar gratis', primary_cta_url: '', secondary_cta_label: '', secondary_cta_url: '', cta_style: 'solid', bg_color: 'var(--accent)', text_color: '#ffffff', bg_image_url: '', overlay_opacity: 0, spacing: { top: 72, bottom: 72 } },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'description', label: 'Descripción', kind: 'textarea', rows: 2, section: 'Contenido' },
    { key: 'alignment', label: 'Alineación', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }], section: 'Contenido' },
    { key: 'primary_cta_label', label: 'Botón principal — texto', kind: 'text', section: 'Botones' },
    { key: 'primary_cta_url', label: 'Botón principal — URL', kind: 'url', section: 'Botones' },
    { key: 'secondary_cta_label', label: 'Botón secundario — texto', kind: 'text', section: 'Botones' },
    { key: 'secondary_cta_url', label: 'Botón secundario — URL', kind: 'url', section: 'Botones' },
    { key: 'cta_style', label: 'Estilo de botones', kind: 'select', options: [{ value: 'solid', label: 'Sólido' }, { value: 'outline', label: 'Contorno' }, { value: 'ghost', label: 'Ghost' }], section: 'Botones' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'bg_image_url', label: 'Imagen de fondo (opcional)', kind: 'image', section: 'Estilo' },
    { key: 'overlay_opacity', label: 'Opacidad del overlay (%)', kind: 'number', min: 0, max: 100, section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    return (
      <section style={{ position: 'relative', background: config.bg_color || 'var(--accent)', color: config.text_color || '#fff', padding: `${config.spacing?.top ?? 72}px ${isMobile ? 24 : 80}px ${config.spacing?.bottom ?? 72}px`, textAlign: config.alignment || 'center', overflow: 'hidden' }}>
        {config.bg_image_url && <img src={config.bg_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />}
        {config.bg_image_url && config.overlay_opacity > 0 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: config.overlay_opacity / 100, zIndex: 1 }} />}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
          {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isMobile ? '1.8rem' : '2.4rem', margin: '0 0 14px', lineHeight: 1.1 }}>{config.title}</h2>}
          {config.description && <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', opacity: .85, lineHeight: 1.6, margin: '0 0 36px' }}>{config.description}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: config.alignment === 'left' ? 'flex-start' : config.alignment === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap' }}>
            {config.primary_cta_label && <a href={config.primary_cta_url || '#'} style={{ padding: '14px 28px', background: config.cta_style === 'outline' || config.cta_style === 'ghost' ? 'transparent' : '#fff', color: config.cta_style === 'outline' || config.cta_style === 'ghost' ? 'inherit' : 'var(--accent)', border: config.cta_style === 'ghost' ? 'none' : '1.5px solid currentColor', borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none' }}>{config.primary_cta_label}</a>}
            {config.secondary_cta_label && <a href={config.secondary_cta_url || '#'} style={{ padding: '13px 28px', background: 'transparent', color: 'inherit', border: '1.5px solid currentColor', borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', opacity: .85 }}>{config.secondary_cta_label}</a>}
          </div>
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
