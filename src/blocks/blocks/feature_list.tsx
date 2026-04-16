import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface FeatureListItem { title: string; description: string; image_url: string; cta_label: string; cta_url: string; }
interface FeatureListConfig { title: string; items: FeatureListItem[]; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<FeatureListConfig> = {
  type: 'feature_list',
  category: 'content',
  label: 'Características alternadas',
  description: 'Filas grandes alternando texto e imagen.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="15" width="18" height="5" rx="1"/></svg>,
  defaultConfig: { title: '', bg_color: '', text_color: '', items: [{ title: 'Característica principal', description: 'Describe en detalle esta característica y por qué importa a tus usuarios.', image_url: '', cta_label: '', cta_url: '' }], spacing: { top: 64, bottom: 64 } },
  schema: [
    { key: 'title', label: 'Título de sección', kind: 'text' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'items', label: 'Características', kind: 'repeater', fields: [{ key: 'title', label: 'Título', kind: 'text' }, { key: 'description', label: 'Descripción', kind: 'richtext' }, { key: 'image_url', label: 'Imagen', kind: 'image' }, { key: 'cta_label', label: 'Texto del botón', kind: 'text' }, { key: 'cta_url', label: 'URL del botón', kind: 'url' }], addLabel: 'Agregar característica' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    const tc = config.text_color || 'var(--text)';
    const tcs = config.text_color || 'var(--text-secondary)';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 24 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: tc, margin: '0 0 56px', textAlign: 'center' }}>{config.title}</h2>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80, maxWidth: 1100, margin: '0 auto' }}>
          {(config.items ?? []).map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: isMobile ? 'column' : i % 2 === 0 ? 'row' : 'row-reverse', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.image_url
                  ? <img src={item.image_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg,20px)', objectFit: 'cover', maxHeight: 380, display: 'block' }} />
                  : <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--border,rgba(0,0,0,.06))', borderRadius: 'var(--radius-lg,20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted,#999)', fontSize: '.8rem' }}>Imagen</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem', color: tc, margin: '0 0 16px', lineHeight: 1.15 }}>{item.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: tcs, fontSize: '.95rem', lineHeight: 1.7, margin: '0 0 24px' }}>{item.description}</p>
                {item.cta_label && <a href={item.cta_url || '#'} style={{ display: 'inline-block', padding: '11px 22px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.87rem', textDecoration: 'none' }}>{item.cta_label}</a>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
