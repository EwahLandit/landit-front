import { useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition, Viewport } from '../types';

interface NavLink { label: string; url: string; }
interface AnnouncementMessage { text: string; url: string; }

interface HeaderConfig {
  bg_color: string;
  text_color: string;
  logo_url: string;
  logo_size: 'small' | 'medium' | 'large';
  brand_name: string;
  brand_name_color: string;
  brand_name_font: string;
  brand_image_url: string;
  nav_links: NavLink[];
  desktop_logo_placement: 'left' | 'center';
  desktop_sticky: boolean;
  desktop_search: 'none' | 'icon' | 'bar';
  mobile_center_logo: boolean;
  mobile_search: 'icon' | 'bar' | 'hamburger';
  announcement_enabled: boolean;
  announcement_bg_color: string;
  announcement_text_color: string;
  announcement_animation: 'none' | 'ltr' | 'pulse';
  announcement_messages: AnnouncementMessage[];
}

const LOGO_SIZE: Record<string, number> = { small: 28, medium: 40, large: 56 };

function AnnouncementBar({ config }: { config: HeaderConfig }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = (config.announcement_messages ?? []).filter(m => m.text.trim());
  if (!config.announcement_enabled || !msgs.length) return null;
  const msg = msgs[msgIdx % msgs.length];

  return (
    <div style={{ background: config.announcement_bg_color, color: config.announcement_text_color, width: '100%', padding: '8px 16px', textAlign: 'center', fontSize: '.82rem', fontFamily: 'var(--font-body)', animation: config.announcement_animation === 'pulse' ? 'ann-pulse 2s ease-in-out infinite' : undefined, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <style>{`
        @keyframes ann-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes ann-ltr { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
        .ann-ltr-inner { display: inline-block; animation: ann-ltr 18s linear infinite; }
      `}</style>
      {config.announcement_animation === 'ltr' ? (
        <span className="ann-ltr-inner">
          {msgs.map((m, i) => (
            <span key={i}>
              {m.url ? <a href={m.url} style={{ color: 'inherit', textDecoration: 'underline' }}>{m.text}</a> : m.text}
              {i < msgs.length - 1 ? <span style={{ margin: '0 32px' }}>·</span> : null}
            </span>
          ))}
        </span>
      ) : (
        <>
          {msg.url ? <a href={msg.url} style={{ color: 'inherit', textDecoration: 'underline' }}>{msg.text}</a> : msg.text}
          {msgs.length > 1 && (
            <button type="button" onClick={() => setMsgIdx(i => i + 1)} style={{ marginLeft: 12, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '.8rem' }}>›</button>
          )}
        </>
      )}
    </div>
  );
}

function HeaderComponent({ config, viewport }: { config: HeaderConfig; mobileConfig?: Partial<HeaderConfig>; viewport: Viewport; blockId: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSizePx = LOGO_SIZE[config.logo_size ?? 'medium'];
  const isMobile = viewport === 'mobile';

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {config.logo_url && <img src={config.logo_url} alt="logo" style={{ height: logoSizePx, width: logoSizePx, objectFit: 'contain' }} />}
      {!config.brand_image_url && config.brand_name && (
        <span style={{ fontFamily: config.brand_name_font || 'var(--font-display)', color: config.brand_name_color || config.text_color, fontWeight: 700, fontSize: '1.1rem' }}>
          {config.brand_name}
        </span>
      )}
      {config.brand_image_url && <img src={config.brand_image_url} alt="brand" style={{ height: logoSizePx * 0.7, objectFit: 'contain' }} />}
    </div>
  );

  const NavLinks = () => (
    <>
      {(config.nav_links ?? []).map((l, i) => (
        <a key={i} href={l.url || '#'} style={{ color: config.text_color, textDecoration: 'none', fontSize: '.88rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          {l.label}
        </a>
      ))}
    </>
  );

  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={config.text_color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );

  return (
    <header style={{ background: config.bg_color, position: config.desktop_sticky && !isMobile ? 'sticky' : 'relative', top: 0, zIndex: 100, width: '100%' }}>
      <style>{`
        .hdr-search-bar { display: flex; align-items: center; gap: 6px; border: 1px solid rgba(0,0,0,.12); border-radius: 999px; padding: 4px 12px; font-size: .82rem; }
        .hdr-search-bar input { border: none; background: none; outline: none; font-size: .82rem; width: 140px; }
        .hdr-hamburger { background: none; border: none; cursor: pointer; padding: 4px; display: flex; flex-direction: column; gap: 5px; }
        .hdr-hamburger span { display: block; width: 22px; height: 2px; background: currentColor; border-radius: 2px; }
        .hdr-mobile-menu { position: absolute; top: 100%; left: 0; right: 0; background: ${config.bg_color}; border-top: 1px solid rgba(0,0,0,.08); padding: 12px 20px; display: flex; flex-direction: column; gap: 12px; z-index: 99; }
      `}</style>
      <AnnouncementBar config={config} />

      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: config.mobile_center_logo ? 'center' : 'space-between', padding: '12px 20px', gap: 12, position: 'relative' }}>
          {!config.mobile_center_logo && <Logo />}
          {config.mobile_center_logo && <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}><Logo /></div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', color: config.text_color }}>
            {config.mobile_search === 'icon' && <SearchIcon />}
            {config.mobile_search === 'bar' && (
              <div className="hdr-search-bar" style={{ color: config.text_color }}>
                <SearchIcon /><input placeholder="Buscar..." />
              </div>
            )}
            <button className="hdr-hamburger" style={{ color: config.text_color }} onClick={() => setMenuOpen(o => !o)}>
              <span /><span /><span />
            </button>
          </div>
          {menuOpen && (
            <div className="hdr-mobile-menu">
              {config.mobile_search === 'hamburger' && (
                <div className="hdr-search-bar" style={{ color: config.text_color }}>
                  <SearchIcon /><input placeholder="Buscar..." />
                </div>
              )}
              <NavLinks />
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: config.desktop_logo_placement === 'center' ? 'center' : 'space-between', padding: '14px 40px', gap: 24, flexWrap: 'wrap' }}>
          <Logo />
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLinks />
          </nav>
          {config.desktop_search === 'icon' && <span style={{ color: config.text_color }}><SearchIcon /></span>}
          {config.desktop_search === 'bar' && (
            <div className="hdr-search-bar" style={{ color: config.text_color }}>
              <SearchIcon /><input placeholder="Buscar..." />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

const headerDef: BlockDefinition<HeaderConfig> = {
  type: 'header',
  category: 'layout',
  label: 'Encabezado',
  description: 'Barra superior con logo, navegación, búsqueda y barra de anuncio opcional.',
  icon: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
    </svg>
  ),
  defaultConfig: {
    bg_color: '#ffffff',
    text_color: '#111111',
    logo_url: '',
    logo_size: 'medium',
    brand_name: 'Mi Marca',
    brand_name_color: '#111111',
    brand_name_font: 'Syne',
    brand_image_url: '',
    nav_links: [
      { label: 'Inicio', url: '#' },
      { label: 'Servicios', url: '#' },
      { label: 'Contacto', url: '#' },
    ],
    desktop_logo_placement: 'left',
    desktop_sticky: false,
    desktop_search: 'none',
    mobile_center_logo: false,
    mobile_search: 'icon',
    announcement_enabled: false,
    announcement_bg_color: '#0057ff',
    announcement_text_color: '#ffffff',
    announcement_animation: 'none',
    announcement_messages: [],
  },
  schema: [
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto e iconos', kind: 'color', section: 'Estilo' },
    { key: 'logo_url', label: 'Logo', kind: 'image', recommendedSize: '300×300 px', section: 'Marca' },
    { key: 'logo_size', label: 'Tamaño del logo', kind: 'select', options: [{ value: 'small', label: 'Pequeño' }, { value: 'medium', label: 'Mediano' }, { value: 'large', label: 'Grande' }], section: 'Marca' },
    { key: 'brand_name', label: 'Nombre de marca (texto)', kind: 'text', placeholder: 'Mi Marca', section: 'Marca' },
    { key: 'brand_name_color', label: 'Color del nombre', kind: 'color', section: 'Marca' },
    { key: 'brand_name_font', label: 'Fuente del nombre', kind: 'font', section: 'Marca' },
    { key: 'brand_image_url', label: 'Imagen del nombre de marca', kind: 'image', description: 'Sube una imagen con tu logotipo en lugar de texto. Si se sube, reemplaza el nombre de texto.', section: 'Marca' },
    { key: 'nav_links', label: 'Vínculos de navegación', kind: 'repeater', fields: [{ key: 'label', label: 'Texto', kind: 'text' }, { key: 'url', label: 'URL', kind: 'url' }], addLabel: 'Agregar vínculo', section: 'Navegación' },
    { key: 'desktop_logo_placement', label: 'Posición del logo (escritorio)', kind: 'select', options: [{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }], section: 'Escritorio' },
    { key: 'desktop_sticky', label: 'Logo siempre visible (sticky)', kind: 'toggle', section: 'Escritorio' },
    { key: 'desktop_search', label: 'Búsqueda (escritorio)', kind: 'select', options: [{ value: 'none', label: 'Ocultar' }, { value: 'icon', label: 'Ícono' }, { value: 'bar', label: 'Barra' }], section: 'Escritorio' },
    { key: 'mobile_center_logo', label: 'Centrar logo en móvil', kind: 'toggle', section: 'Móvil' },
    { key: 'mobile_search', label: 'Búsqueda (móvil)', kind: 'select', options: [{ value: 'icon', label: 'Ícono' }, { value: 'bar', label: 'Barra' }, { value: 'hamburger', label: 'Dentro del menú' }], section: 'Móvil' },
    { key: 'announcement_enabled', label: 'Mostrar barra de anuncio', kind: 'toggle', section: 'Barra de anuncio' },
    { key: 'announcement_bg_color', label: 'Fondo del anuncio', kind: 'color', section: 'Barra de anuncio' },
    { key: 'announcement_text_color', label: 'Texto del anuncio', kind: 'color', section: 'Barra de anuncio' },
    { key: 'announcement_animation', label: 'Animación del anuncio', kind: 'select', options: [{ value: 'none', label: 'Ninguna' }, { value: 'ltr', label: 'Izquierda a derecha' }, { value: 'pulse', label: 'Pulsante' }], section: 'Barra de anuncio' },
    { key: 'announcement_messages', label: 'Mensajes del anuncio', kind: 'repeater', maxItems: 3, fields: [{ key: 'text', label: 'Mensaje', kind: 'text' }, { key: 'url', label: 'Enlace (opcional)', kind: 'url' }], addLabel: 'Agregar mensaje', section: 'Barra de anuncio' },
  ],
  Component: HeaderComponent,
};

registerBlock(headerDef);

export default headerDef;
