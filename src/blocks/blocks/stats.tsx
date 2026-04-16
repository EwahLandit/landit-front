import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface StatItem { value: string; label: string; suffix: string; }
interface StatsConfig { items: StatItem[]; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<StatsConfig> = {
  type: 'stats',
  category: 'content',
  label: 'Estadísticas',
  description: 'Números destacados con etiquetas y sufijos.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  defaultConfig: { items: [{ value: '10K', label: 'Clientes activos', suffix: '+' }, { value: '98', label: 'Satisfacción', suffix: '%' }, { value: '24/7', label: 'Soporte', suffix: '' }], bg_color: '', text_color: '', spacing: { top: 64, bottom: 64 } },
  schema: [
    { key: 'bg_color', label: 'Color de fondo', kind: 'color' },
    { key: 'text_color', label: 'Color de texto', kind: 'color' },
    { key: 'items', label: 'Estadísticas', kind: 'repeater', fields: [{ key: 'value', label: 'Valor', kind: 'text' }, { key: 'suffix', label: 'Sufijo', kind: 'text' }, { key: 'label', label: 'Etiqueta', kind: 'text' }], addLabel: 'Agregar estadística' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', color: config.text_color || 'var(--text)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 24 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${Math.min(config.items?.length || 3, 5)}, 1fr)`, gap: 32, textAlign: 'center' }}>
          {(config.items ?? []).map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isMobile ? '2rem' : '2.8rem', color: 'var(--accent)', lineHeight: 1 }}>{s.value}{s.suffix}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem', opacity: .65, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
