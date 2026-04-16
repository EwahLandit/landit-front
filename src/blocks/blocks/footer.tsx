import { registerBlock } from '../registry';
import type { BlockDefinition, Viewport } from '../types';

interface FooterLink { label: string; url: string; }
interface FooterColumn { heading: string; links: FooterLink[]; }
interface SocialLink { platform: string; url: string; }

interface FooterConfig {
  bg_color: string;
  text_color: string;
  copyright: string;
  columns: FooterColumn[];
  social_links: SocialLink[];
  newsletter_enabled: boolean;
  newsletter_placeholder: string;
  newsletter_btn_label: string;
  logo_url: string;
  brand_name: string;
  tagline: string;
}

const PLATFORM_ICONS: Record<string, JSX.Element> = {
  twitter: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  youtube: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
  whatsapp: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
};

function FooterComponent({ config, viewport }: { config: FooterConfig; mobileConfig?: Partial<FooterConfig>; viewport: Viewport; blockId: string }) {
  const isMobile = viewport === 'mobile';
  const cols = config.columns ?? [];
  const socials = (config.social_links ?? []).filter(s => s.url);

  return (
    <footer style={{ background: config.bg_color || '#111', color: config.text_color || '#fff', padding: isMobile ? '40px 20px 24px' : '60px 80px 32px', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .ftr-grid { display: grid; grid-template-columns: ${isMobile ? '1fr' : `2fr ${cols.length ? `repeat(${Math.min(cols.length, 4)}, 1fr)` : ''}`}; gap: ${isMobile ? '32px' : '48px'}; margin-bottom: 40px; }
        .ftr-col-heading { font-size: .72rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .55; margin-bottom: 14px; }
        .ftr-link { display: block; font-size: .85rem; opacity: .75; text-decoration: none; color: inherit; margin-bottom: 8px; transition: opacity .15s; }
        .ftr-link:hover { opacity: 1; }
        .ftr-socials { display: flex; gap: 14px; margin-top: 20px; }
        .ftr-social-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,.2); color: inherit; text-decoration: none; transition: background .15s; }
        .ftr-social-btn:hover { background: rgba(255,255,255,.1); }
        .ftr-newsletter { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .ftr-newsletter input { flex: 1; min-width: 160px; padding: 10px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.07); color: inherit; font-size: .85rem; outline: none; }
        .ftr-newsletter button { padding: 10px 20px; border-radius: 9999px; background: var(--accent); color: #fff; border: none; font-size: .85rem; font-weight: 600; cursor: pointer; }
        .ftr-bottom { border-top: 1px solid rgba(255,255,255,.1); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: .78rem; opacity: .5; }
      `}</style>

      <div className="ftr-grid">
        <div>
          {config.logo_url && <img src={config.logo_url} alt="logo" style={{ height: 36, objectFit: 'contain', marginBottom: 12 }} />}
          {config.brand_name && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{config.brand_name}</div>}
          {config.tagline && <p style={{ fontSize: '.85rem', opacity: .7, lineHeight: 1.5 }}>{config.tagline}</p>}
          {socials.length > 0 && (
            <div className="ftr-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.url} className="ftr-social-btn" target="_blank" rel="noopener noreferrer" aria-label={s.platform}>
                  {PLATFORM_ICONS[s.platform] ?? <span style={{ fontSize: '.7rem' }}>{s.platform[0].toUpperCase()}</span>}
                </a>
              ))}
            </div>
          )}
          {config.newsletter_enabled && (
            <>
              <p style={{ fontSize: '.82rem', opacity: .7, marginTop: 20, marginBottom: 6 }}>Suscríbete a nuestro boletín</p>
              <div className="ftr-newsletter">
                <input type="email" placeholder={config.newsletter_placeholder || 'tu@email.com'} />
                <button type="button">{config.newsletter_btn_label || 'Suscribirse'}</button>
              </div>
            </>
          )}
        </div>

        {cols.map((col, i) => (
          <div key={i}>
            <div className="ftr-col-heading">{col.heading}</div>
            {(col.links ?? []).map((l, j) => (
              <a key={j} href={l.url || '#'} className="ftr-link">{l.label}</a>
            ))}
          </div>
        ))}
      </div>

      <div className="ftr-bottom">
        <span>{config.copyright || `© ${new Date().getFullYear()}`}</span>
      </div>
    </footer>
  );
}

const footerDef: BlockDefinition<FooterConfig> = {
  type: 'footer',
  category: 'layout',
  label: 'Pie de página',
  description: 'Pie con logo, columnas de enlaces, redes sociales y suscripción al boletín.',
  icon: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/>
    </svg>
  ),
  defaultConfig: {
    bg_color: '#111111',
    text_color: '#ffffff',
    copyright: `© ${new Date().getFullYear()} Mi Marca. Todos los derechos reservados.`,
    columns: [
      { heading: 'Producto', links: [{ label: 'Características', url: '#' }, { label: 'Precios', url: '#' }] },
      { heading: 'Empresa', links: [{ label: 'Acerca de', url: '#' }, { label: 'Contacto', url: '#' }] },
    ],
    social_links: [],
    newsletter_enabled: false,
    newsletter_placeholder: 'tu@email.com',
    newsletter_btn_label: 'Suscribirse',
    logo_url: '',
    brand_name: '',
    tagline: '',
  },
  schema: [
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'logo_url', label: 'Logo', kind: 'image', section: 'Marca' },
    { key: 'brand_name', label: 'Nombre de marca', kind: 'text', section: 'Marca' },
    { key: 'tagline', label: 'Tagline', kind: 'text', section: 'Marca' },
    { key: 'copyright', label: 'Texto de copyright', kind: 'text', section: 'Marca' },
    { key: 'columns', label: 'Columnas de navegación', kind: 'repeater', fields: [{ key: 'heading', label: 'Encabezado', kind: 'text' }, { key: 'links', label: 'Vínculos', kind: 'repeater', fields: [{ key: 'label', label: 'Texto', kind: 'text' }, { key: 'url', label: 'URL', kind: 'url' }], addLabel: 'Agregar vínculo' }], addLabel: 'Agregar columna', section: 'Navegación' },
    { key: 'social_links', label: 'Redes sociales', kind: 'repeater', fields: [{ key: 'platform', label: 'Plataforma', kind: 'select', options: ['twitter', 'instagram', 'facebook', 'linkedin', 'youtube', 'whatsapp'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })) }, { key: 'url', label: 'URL del perfil', kind: 'url' }], addLabel: 'Agregar red social', section: 'Redes sociales' },
    { key: 'newsletter_enabled', label: 'Mostrar suscripción al boletín', kind: 'toggle', section: 'Boletín' },
    { key: 'newsletter_placeholder', label: 'Placeholder del campo', kind: 'text', section: 'Boletín' },
    { key: 'newsletter_btn_label', label: 'Texto del botón', kind: 'text', section: 'Boletín' },
  ],
  Component: FooterComponent,
};

registerBlock(footerDef);

export default footerDef;
