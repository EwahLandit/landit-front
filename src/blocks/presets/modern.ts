import type { SiteContentV2 } from '../types';

export const modernPreset: SiteContentV2 = {
  schema_version: 2,
  site: { title: 'Mi Marca', favicon: null, seo: { meta_title: '', meta_description: '', og_image: null } },
  theme: { accent: '#0057ff', bg: '#f9f9f8', text: '#111111', font_display: 'Syne', font_body: 'DM Sans' },
  blocks: [
    {
      id: 'blk_mod_hdr',
      type: 'header',
      visible: true,
      config: {
        bg_color: '#ffffff', text_color: '#111111', logo_url: '', logo_size: 'medium',
        brand_name: 'Mi Marca', brand_name_color: '#111111', brand_name_font: 'Syne', brand_image_url: '',
        nav_links: [{ label: 'Características', url: '#features' }, { label: 'Precios', url: '#pricing' }, { label: 'Contacto', url: '#contact' }],
        desktop_logo_placement: 'left', desktop_sticky: true, desktop_search: 'none',
        mobile_center_logo: false, mobile_search: 'icon',
        announcement_enabled: false, announcement_bg_color: '#0057ff', announcement_text_color: '#ffffff',
        announcement_animation: 'none', announcement_messages: [],
      },
    },
    {
      id: 'blk_mod_hero',
      type: 'hero',
      visible: true,
      config: {
        eyebrow: '✨ Nuevo · Lanzamiento 2026',
        title: 'Tu Título Principal Aquí',
        subtitle: 'Describe tu propuesta de valor en una sola oración clara y atractiva.',
        primary_cta_label: 'Comenzar Ahora', primary_cta_url: '',
        secondary_cta_label: 'Ver Demo', secondary_cta_url: '',
        alignment: 'center', media_type: 'none', media_url: '', overlay_opacity: 0,
        min_height: '85vh', bg_color: '', text_color: '', spacing: { top: 0, bottom: 0 },
      },
    },
    {
      id: 'blk_mod_feat',
      type: 'feature_grid',
      visible: true,
      config: {
        title: 'Todo lo que necesitas',
        subtitle: 'Herramientas potentes para llevar tu negocio al siguiente nivel.',
        columns: 3, bg_color: '#ffffff', spacing: { top: 80, bottom: 80 },
        items: [
          { icon: '⚡', title: 'Rápido y Eficiente', description: 'Resultados en tiempo récord sin comprometer la calidad.', link: '' },
          { icon: '🎯', title: 'Enfocado en Resultados', description: 'Cada decisión está orientada a maximizar tu ROI.', link: '' },
          { icon: '🔒', title: 'Seguro y Confiable', description: 'Tu información y la de tus clientes siempre protegida.', link: '' },
        ],
      },
    },
    {
      id: 'blk_mod_cta',
      type: 'cta_banner',
      visible: true,
      config: {
        title: '¿Listo para empezar?',
        description: 'Únete a cientos de clientes que ya están creciendo con nosotros.',
        primary_cta_label: 'Empezar Gratis', primary_cta_url: '',
        secondary_cta_label: '', secondary_cta_url: '',
        bg_color: '#0057ff', text_color: '#ffffff', bg_image_url: '', overlay_opacity: 0,
        spacing: { top: 72, bottom: 72 },
      },
    },
    {
      id: 'blk_mod_ftr',
      type: 'footer',
      visible: true,
      config: {
        bg_color: '#111111', text_color: '#ffffff',
        copyright: `© ${new Date().getFullYear()} Mi Marca. Todos los derechos reservados.`,
        columns: [{ heading: 'Producto', links: [{ label: 'Características', url: '#' }, { label: 'Precios', url: '#' }] }, { heading: 'Empresa', links: [{ label: 'Acerca de', url: '#' }, { label: 'Contacto', url: '#' }] }],
        social_links: [], newsletter_enabled: false, newsletter_placeholder: 'tu@email.com', newsletter_btn_label: 'Suscribirse', logo_url: '', brand_name: '', tagline: '',
      },
    },
  ],
};
