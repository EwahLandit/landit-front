import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface LogoItem { url: string; alt: string; link: string; }
interface LogoStripConfig { title: string; logos: LogoItem[]; grayscale: boolean; scroll_speed: number; direction: 'left' | 'right'; pause_on_hover: boolean; bg_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<LogoStripConfig> = {
  type: 'logo_strip',
  category: 'media',
  label: 'Franja de logos / Marquee',
  description: 'Logos de clientes o partners con desplazamiento automático.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M7 12h10"/></svg>,
  defaultConfig: { title: 'Confían en nosotros', logos: [], grayscale: true, scroll_speed: 20, direction: 'left', pause_on_hover: true, bg_color: '', spacing: { top: 48, bottom: 48 } },
  schema: [
    { key: 'title', label: 'Título (opcional)', kind: 'text', section: 'Contenido' },
    { key: 'logos', label: 'Logos', kind: 'repeater', fields: [{ key: 'url', label: 'Imagen del logo', kind: 'image' }, { key: 'alt', label: 'Nombre (alt)', kind: 'text' }, { key: 'link', label: 'URL (opcional)', kind: 'url' }], addLabel: 'Agregar logo', section: 'Contenido' },
    { key: 'grayscale', label: 'Logos en escala de grises', kind: 'toggle', section: 'Estilo' },
    { key: 'scroll_speed', label: 'Velocidad de desplazamiento (s)', kind: 'number', min: 5, max: 60, section: 'Estilo' },
    { key: 'direction', label: 'Dirección', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'right', label: 'Derecha' }], section: 'Estilo' },
    { key: 'pause_on_hover', label: 'Pausar al pasar el cursor', kind: 'toggle', section: 'Estilo' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config }) => {
    const logos = config.logos ?? [];
    const speed = config.scroll_speed || 20;
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 48}px 0 ${config.spacing?.bottom ?? 48}px`, overflow: 'hidden' }}>
        <style>{`@keyframes marquee-left{from{transform:translateX(0)}to{transform:translateX(-50%)}} @keyframes marquee-right{from{transform:translateX(-50%)}to{transform:translateX(0)}} .logo-strip-track:hover{animation-play-state:paused}`}</style>
        {config.title && <p style={{ fontFamily: 'var(--font-display)', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted,#999)', textAlign: 'center', marginBottom: 28 }}>{config.title}</p>}
        {logos.length > 0 ? (
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <div className={config.pause_on_hover !== false ? 'logo-strip-track' : undefined} style={{ display: 'flex', gap: 48, alignItems: 'center', animation: `${config.direction === 'right' ? 'marquee-right' : 'marquee-left'} ${speed}s linear infinite`, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {[...logos, ...logos].map((l, i) => {
                const img = <img key={i} src={l.url} alt={l.alt || ''} style={{ height: 36, objectFit: 'contain', filter: config.grayscale ? 'grayscale(1) opacity(.5)' : 'none', transition: 'filter .2s' }} />;
                return l.link ? <a key={i} href={l.link} target="_blank" rel="noopener noreferrer">{img}</a> : img;
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, opacity: .3, flexWrap: 'wrap', padding: '0 40px' }}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ width: 80, height: 28, background: 'var(--border,rgba(0,0,0,.1))', borderRadius: 4 }} />)}
          </div>
        )}
      </section>
    );
  },
};
registerBlock(def);
export default def;
