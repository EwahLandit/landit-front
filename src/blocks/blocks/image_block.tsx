import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface ImageBlockConfig { url: string; alt: string; link: string; rounded: boolean; caption: string; max_width: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<ImageBlockConfig> = {
  type: 'image_block',
  category: 'media',
  label: 'Imagen',
  description: 'Imagen individual con texto alternativo, caption y enlace opcional.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  defaultConfig: { url: '', alt: '', link: '', rounded: true, caption: '', max_width: '100%', spacing: { top: 32, bottom: 32 } },
  schema: [
    { key: 'url', label: 'Imagen', kind: 'image', section: 'Contenido' },
    { key: 'alt', label: 'Texto alternativo', kind: 'text', section: 'Contenido' },
    { key: 'link', label: 'Enlace al hacer clic', kind: 'url', section: 'Contenido' },
    { key: 'caption', label: 'Pie de foto', kind: 'text', section: 'Contenido' },
    { key: 'rounded', label: 'Bordes redondeados', kind: 'toggle', section: 'Estilo' },
    { key: 'max_width', label: 'Ancho máximo', kind: 'text', placeholder: '100%', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config }) => {
    const img = <img src={config.url} alt={config.alt || ''} style={{ width: '100%', maxWidth: config.max_width || '100%', borderRadius: config.rounded ? '12px' : 0, display: 'block' }} />;
    return (
      <div style={{ padding: `${config.spacing?.top ?? 32}px 40px ${config.spacing?.bottom ?? 32}px`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {config.link ? <a href={config.link}>{img}</a> : img}
        {config.caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'var(--text-muted,#999)', marginTop: 8, textAlign: 'center' }}>{config.caption}</p>}
      </div>
    );
  },
};
registerBlock(def);
export default def;
