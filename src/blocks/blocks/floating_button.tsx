import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface FloatingButtonConfig { type: 'whatsapp' | 'scroll_top' | 'custom'; url: string; phone: string; message: string; label: string; show_label_on_desktop: boolean; bg_color: string; position: 'bottom-right' | 'bottom-left'; offset_x: number; offset_y: number; size: 'sm' | 'md' | 'lg'; }

const def: BlockDefinition<FloatingButtonConfig> = {
  type: 'floating_button',
  category: 'utility',
  label: 'Botón flotante',
  description: 'Botón fijo en pantalla — WhatsApp, volver arriba o URL personalizada.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  defaultConfig: { type: 'whatsapp', url: '', phone: '', message: '', label: '¿Necesitás ayuda?', show_label_on_desktop: false, bg_color: '#25D366', position: 'bottom-right', offset_x: 20, offset_y: 24, size: 'md' },
  schema: [
    { key: 'type', label: 'Tipo', kind: 'select', options: [{ value: 'whatsapp', label: 'WhatsApp' }, { value: 'scroll_top', label: 'Volver arriba' }, { value: 'custom', label: 'URL personalizada' }], section: 'Contenido' },
    { key: 'phone', label: 'Número de WhatsApp (con código de país)', kind: 'text', placeholder: '+5491112345678', section: 'Contenido' },
    { key: 'message', label: 'Mensaje de WhatsApp predefinido', kind: 'text', section: 'Contenido' },
    { key: 'url', label: 'URL (para tipo personalizado)', kind: 'url', section: 'Contenido' },
    { key: 'label', label: 'Tooltip / etiqueta', kind: 'text', section: 'Contenido' },
    { key: 'show_label_on_desktop', label: 'Mostrar etiqueta en escritorio', kind: 'toggle', section: 'Contenido' },
    { key: 'bg_color', label: 'Color del botón', kind: 'color', section: 'Estilo' },
    { key: 'position', label: 'Posición', kind: 'select', options: [{ value: 'bottom-right', label: 'Abajo derecha' }, { value: 'bottom-left', label: 'Abajo izquierda' }], section: 'Estilo' },
    { key: 'size', label: 'Tamaño', kind: 'select', options: [{ value: 'sm', label: 'Pequeño (48px)' }, { value: 'md', label: 'Mediano (56px)' }, { value: 'lg', label: 'Grande (64px)' }], section: 'Estilo' },
    { key: 'offset_x', label: 'Separación horizontal (px)', kind: 'number', min: 8, max: 80, step: 4, section: 'Estilo' },
    { key: 'offset_y', label: 'Separación vertical (px)', kind: 'number', min: 8, max: 120, step: 4, section: 'Estilo' },
  ],
  Component: ({ config }) => {
    const offsetX = config.offset_x ?? 20;
    const offsetY = config.offset_y ?? 24;
    const pos = config.position === 'bottom-left' ? { left: offsetX } : { right: offsetX };
    const sizeMap = { sm: 48, md: 56, lg: 64 };
    const btnSize = sizeMap[config.size ?? 'md'];
    let href = config.url;
    if (config.type === 'whatsapp') {
      const phone = (config.phone || '').replace(/[^0-9]/g, '');
      href = `https://wa.me/${phone}${config.message ? `?text=${encodeURIComponent(config.message)}` : ''}`;
    } else if (config.type === 'scroll_top') {
      href = '#top';
    }

    const WhatsAppIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
    const UpIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;

    return (
      <div style={{ position: 'fixed', bottom: offsetY, ...pos, zIndex: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
        {config.show_label_on_desktop && config.label && (
          <span style={{ background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: '.78rem', fontFamily: 'var(--font-body)', fontWeight: 600, padding: '6px 12px', borderRadius: 'var(--radius-full,9999px)', whiteSpace: 'nowrap' }}>{config.label}</span>
        )}
        <a href={href} target={config.type !== 'scroll_top' ? '_blank' : '_self'} rel="noopener noreferrer" title={config.label} style={{ width: btnSize, height: btnSize, borderRadius: '50%', background: config.bg_color || '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,.25)', textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', flexShrink: 0 }}>
          {config.type === 'scroll_top' ? <UpIcon /> : <WhatsAppIcon />}
        </a>
      </div>
    );
  },
};
registerBlock(def);
export default def;
