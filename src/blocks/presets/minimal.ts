import type { SiteContentV2 } from '../types';

export const minimalPreset: SiteContentV2 = {
  schema_version: 2,
  site: { title: 'Portfolio', favicon: null, seo: { meta_title: '', meta_description: '', og_image: null } },
  theme: { accent: '#111111', bg: '#ffffff', text: '#111111', font_display: 'Syne', font_body: 'DM Sans' },
  blocks: [
    {
      id: 'blk_min_hdr',
      type: 'header',
      visible: true,
      config: {
        bg_color: '#ffffff', text_color: '#111111', logo_url: '', logo_size: 'small',
        brand_name: 'Tu Nombre', brand_name_color: '#111111', brand_name_font: 'Syne', brand_image_url: '',
        nav_links: [{ label: 'Trabajo', url: '#work' }, { label: 'Sobre mí', url: '#about' }, { label: 'Contacto', url: '#contact' }],
        desktop_logo_placement: 'left', desktop_sticky: false, desktop_search: 'none',
        mobile_center_logo: false, mobile_search: 'hamburger',
        announcement_enabled: false, announcement_bg_color: '#111', announcement_text_color: '#fff',
        announcement_animation: 'none', announcement_messages: [],
      },
    },
    { id: 'blk_min_div0', type: 'divider', visible: true, config: { style: 'solid', color: 'rgba(0,0,0,0.08)', width: '100%', spacing: 0 } },
    {
      id: 'blk_min_hero',
      type: 'hero',
      visible: true,
      config: {
        eyebrow: '',
        title: 'Diseñador & Desarrollador',
        subtitle: 'Creo experiencias digitales simples, funcionales y memorables.',
        primary_cta_label: 'Ver mi trabajo', primary_cta_url: '#work',
        secondary_cta_label: '', secondary_cta_url: '',
        alignment: 'left', media_type: 'none', media_url: '', overlay_opacity: 0,
        min_height: '70vh', bg_color: '#ffffff', text_color: '#111111', spacing: { top: 60, bottom: 60 },
      },
    },
    {
      id: 'blk_min_feat',
      type: 'feature_grid',
      visible: true,
      config: {
        title: 'Servicios', subtitle: '', columns: 3, bg_color: '#f9f9f8', spacing: { top: 72, bottom: 72 },
        items: [
          { icon: '', title: 'Diseño UI/UX', description: 'Interfaces limpias que priorizan la experiencia del usuario.', link: '' },
          { icon: '', title: 'Desarrollo Web', description: 'Código moderno, performante y mantenible.', link: '' },
          { icon: '', title: 'Consultoría', description: 'Asesoramiento estratégico para tu proyecto digital.', link: '' },
        ],
      },
    },
    {
      id: 'blk_min_ftr',
      type: 'footer',
      visible: true,
      config: {
        bg_color: '#ffffff', text_color: '#111111',
        copyright: `© ${new Date().getFullYear()}`,
        columns: [], social_links: [], newsletter_enabled: false, newsletter_placeholder: 'tu@email.com', newsletter_btn_label: 'Suscribirse', logo_url: '', brand_name: '', tagline: '',
      },
    },
  ],
};
