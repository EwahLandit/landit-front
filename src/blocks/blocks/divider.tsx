import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface DividerConfig { style: 'solid' | 'dashed' | 'dotted'; color: string; width: string; spacing: number; }

const def: BlockDefinition<DividerConfig> = {
  type: 'divider',
  category: 'layout',
  label: 'Divisor',
  description: 'Línea horizontal divisoria entre secciones.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>,
  defaultConfig: { style: 'solid', color: 'rgba(0,0,0,0.1)', width: '80%', spacing: 24 },
  schema: [
    { key: 'style', label: 'Estilo', kind: 'select', options: [{ value: 'solid', label: 'Sólido' }, { value: 'dashed', label: 'Guiones' }, { value: 'dotted', label: 'Puntos' }] },
    { key: 'color', label: 'Color', kind: 'color' },
    { key: 'width', label: 'Ancho', kind: 'text', placeholder: '80%' },
    { key: 'spacing', label: 'Margen vertical (px)', kind: 'number', min: 0, max: 120 },
  ],
  Component: ({ config }) => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: `${config.spacing ?? 24}px 0` }}>
      <hr style={{ width: config.width || '80%', border: 'none', borderTop: `1px ${config.style || 'solid'} ${config.color || 'rgba(0,0,0,.1)'}`, margin: 0 }} />
    </div>
  ),
};
registerBlock(def);
export default def;
