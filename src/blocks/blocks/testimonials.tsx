import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface Testimonial { avatar: string; name: string; role: string; company: string; quote: string; link: string; }
interface TestimonialsConfig { title: string; items: Testimonial[]; bg_color: string; text_color: string; card_bg_color: string; card_text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<TestimonialsConfig> = {
  type: 'testimonials',
  category: 'social',
  label: 'Testimonios',
  description: 'Grilla de testimonios de clientes con foto, nombre y cita.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  defaultConfig: {
    title: 'Lo que dicen nuestros clientes',
    bg_color: '', text_color: '', card_bg_color: '', card_text_color: '',
    spacing: { top: 64, bottom: 64 },
    items: [
      { avatar: '', name: 'Ana García', role: 'CEO', company: 'TechStartup', quote: 'Esta plataforma transformó cómo presentamos nuestra empresa al mundo. Increíble.', link: '' },
      { avatar: '', name: 'Carlos López', role: 'Fundador', company: 'AgenciaDigital', quote: 'El mejor constructor de landing pages que he probado. Rápido, hermoso y sin fricción.', link: '' },
    ],
  },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'items', label: 'Testimonios', kind: 'repeater', fields: [{ key: 'avatar', label: 'Foto de perfil', kind: 'image' }, { key: 'name', label: 'Nombre', kind: 'text' }, { key: 'role', label: 'Cargo', kind: 'text' }, { key: 'company', label: 'Empresa', kind: 'text' }, { key: 'quote', label: 'Testimonio', kind: 'textarea', rows: 3 }, { key: 'link', label: 'URL (web de la empresa)', kind: 'url' }], addLabel: 'Agregar testimonio', section: 'Contenido' },
    { key: 'bg_color', label: 'Color de fondo (sección)', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto (título)', kind: 'color', section: 'Estilo' },
    { key: 'card_bg_color', label: 'Color de fondo (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'card_text_color', label: 'Color de texto (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    const items = config.items ?? [];
    // Section-level
    const tc = config.text_color || 'var(--text)';
    // Card-level
    const cardBg = config.card_bg_color || 'var(--bg-card,#fff)';
    const cardTc = config.card_text_color || 'var(--text)';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 20 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: tc, margin: '0 0 48px', textAlign: 'center' }}>{config.title}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(items.length || 1, 3)}, 1fr)`, gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {items.map((t, i) => (
            <div key={i} style={{ background: cardBg, border: '1px solid var(--border,rgba(0,0,0,.08))', borderRadius: 'var(--radius-lg,20px)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '.92rem', color: cardTc, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 }}>{t.name?.[0] ?? '?'}</div>
                )}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: cardTc }}>
                    {t.link ? <a href={t.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{t.name}</a> : t.name}
                  </div>
                  {(t.role || t.company) && <div style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'var(--text-muted,#999)' }}>{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                </div>
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
