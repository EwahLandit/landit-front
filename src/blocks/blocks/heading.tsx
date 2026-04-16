import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface HeadingConfig { text: string; level: 'h1' | 'h2' | 'h3'; alignment: 'left' | 'center' | 'right'; color: string; font_size: string; body_text: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<HeadingConfig> = {
  type: 'heading',
  category: 'content',
  label: 'Título y texto',
  description: 'Encabezado con texto opcional.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>,
  defaultConfig: { text: 'Tu título aquí', level: 'h2', alignment: 'center', color: '', font_size: '2.4rem', body_text: '', spacing: { top: 48, bottom: 24 } },
  schema: [
    { key: 'text', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'body_text', label: 'Texto complementario', kind: 'textarea', rows: 3, section: 'Contenido' },
    { key: 'level', label: 'Nivel HTML', kind: 'select', options: [{ value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }], section: 'Estilo' },
    { key: 'alignment', label: 'Alineación', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }], section: 'Estilo' },
    { key: 'color', label: 'Color', kind: 'color', section: 'Estilo' },
    { key: 'font_size', label: 'Tamaño de fuente', kind: 'text', placeholder: '2.4rem', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config }) => {
    const Tag = config.level || 'h2';
    return (
      <div style={{ padding: `${config.spacing?.top ?? 48}px 40px ${config.spacing?.bottom ?? 24}px`, textAlign: config.alignment as never || 'center' }}>
        <Tag style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: config.font_size || '2.4rem', color: config.color || 'var(--text)', margin: 0, lineHeight: 1.1 }}>{config.text}</Tag>
        {config.body_text && <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: config.color || 'var(--text-secondary)', opacity: .75, lineHeight: 1.7, marginTop: 14, maxWidth: 640, marginInline: 'auto' }}>{config.body_text}</p>}
      </div>
    );
  },
};
registerBlock(def);
export default def;
