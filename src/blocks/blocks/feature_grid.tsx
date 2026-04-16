import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface FeatureItem { icon: string; title: string; description: string; link: string; }
interface FeatureGridConfig { title: string; subtitle: string; columns: 2 | 3 | 4; items: FeatureItem[]; bg_color: string; text_color: string; card_bg_color: string; card_text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<FeatureGridConfig> = {
  type: 'feature_grid',
  category: 'content',
  label: 'Grilla de características',
  description: 'Cuadrícula de características con íconos, títulos y descripciones.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  defaultConfig: {
    title: 'Todo lo que necesitas', subtitle: '', columns: 3,
    bg_color: '', text_color: '', card_bg_color: '', card_text_color: '',
    items: [
      { icon: '⚡', title: 'Rápido', description: 'Resultados en tiempo récord.', link: '' },
      { icon: '🎯', title: 'Preciso', description: 'Cada decisión orientada a tus metas.', link: '' },
      { icon: '🔒', title: 'Seguro', description: 'Tu información siempre protegida.', link: '' },
    ],
    spacing: { top: 64, bottom: 64 },
  },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'textarea', rows: 2, section: 'Contenido' },
    { key: 'items', label: 'Características', kind: 'repeater', fields: [{ key: 'icon', label: 'Ícono (emoji)', kind: 'text' }, { key: 'title', label: 'Título', kind: 'text' }, { key: 'description', label: 'Descripción', kind: 'textarea', rows: 2 }, { key: 'link', label: 'Enlace (opcional)', kind: 'url' }], addLabel: 'Agregar característica', section: 'Contenido' },
    { key: 'columns', label: 'Columnas', kind: 'select', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }], section: 'Estilo' },
    { key: 'bg_color', label: 'Color de fondo (sección)', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto (título y subtítulo)', kind: 'color', section: 'Estilo' },
    { key: 'card_bg_color', label: 'Color de fondo (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'card_text_color', label: 'Color de texto (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config, viewport }) => {
    const cols = Number(config.columns) || 3;
    const isMobile = viewport === 'mobile';
    // Section-level text (title / subtitle)
    const tc = config.text_color || 'var(--text)';
    const tcs = config.text_color || 'var(--text-secondary)';
    // Card-level colors (independent of section bg)
    const cardBg = config.card_bg_color || 'var(--bg-card, #fff)';
    const cardTc = config.card_text_color || 'var(--text)';
    const cardTcs = config.card_text_color || 'var(--text-secondary)';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 20 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        {(config.title || config.subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isMobile ? '1.8rem' : '2.2rem', color: tc, margin: '0 0 12px' }}>{config.title}</h2>}
            {config.subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: tcs, opacity: .75, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>{config.subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(cols, 4)}, 1fr)`, gap: 24 }}>
          {(config.items ?? []).map((item, i) => (
            <div key={i} style={{ background: cardBg, border: '1px solid var(--border, rgba(0,0,0,.08))', borderRadius: 'var(--radius-lg, 20px)', padding: '28px 24px' }}>
              {item.icon && <div style={{ fontSize: '2rem', marginBottom: 14 }}>{item.icon}</div>}
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: cardTc, margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem', color: cardTcs, lineHeight: 1.6, margin: 0 }}>{item.description}</p>
              {item.link && <a href={item.link} style={{ display: 'inline-block', marginTop: 12, fontSize: '.82rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Ver más →</a>}
            </div>
          ))}
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
