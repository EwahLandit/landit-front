import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface SpacerConfig { height_desktop: number; height_mobile: number; }

const def: BlockDefinition<SpacerConfig> = {
  type: 'spacer',
  category: 'layout',
  label: 'Espaciador',
  description: 'Espacio en blanco configurable entre bloques.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  defaultConfig: { height_desktop: 80, height_mobile: 40 },
  schema: [
    { key: 'height_desktop', label: 'Altura escritorio (px)', kind: 'number', min: 0, max: 400 },
    { key: 'height_mobile', label: 'Altura móvil (px)', kind: 'number', min: 0, max: 200 },
  ],
  Component: ({ config, viewport }) => (
    <div style={{ height: viewport === 'mobile' ? config.height_mobile : config.height_desktop }} />
  ),
};
registerBlock(def);
export default def;
