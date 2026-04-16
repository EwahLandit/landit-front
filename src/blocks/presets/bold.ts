import type { SiteContentV2 } from '../types';

export const boldPreset: SiteContentV2 = {
  schema_version: 2,
  site: { title: 'Mi Agencia', favicon: null, seo: { meta_title: '', meta_description: '', og_image: null } },
  theme: { accent: '#ff3c00', bg: '#0a0a0a', text: '#ffffff', font_display: 'Syne', font_body: 'DM Sans' },
  blocks: [
    {
      id: 'blk_bld_hdr',
      type: 'header',
      visible: true,
      config: {
        bg_color: 'transparent', text_color: '#ffffff', logo_url: '', logo_size: 'small',
        brand_name: 'AGENCIA', brand_name_color: '#ffffff', brand_name_font: 'Syne', brand_image_url: '',
        nav_links: [{ label: 'Trabajo', url: '#work' }, { label: 'Nosotros', url: '#about' }, { label: 'Contacto', url: '#contact' }],
        desktop_logo_placement: 'left', desktop_sticky: false, desktop_search: 'none',
        mobile_center_logo: false, mobile_search: 'hamburger',
        announcement_enabled: false, announcement_bg_color: '#ff3c00', announcement_text_color: '#fff',
        announcement_animation: 'none', announcement_messages: [],
      },
    },
    {
      id: 'blk_bld_hero',
      type: 'hero',
      visible: true,
      config: {
        eyebrow: '✦ Resultados que se ven',
        title: 'Creamos marcas que dejan huella.',
        subtitle: 'Estrategia, diseño y tecnología al servicio de tu crecimiento.',
        primary_cta_label: 'Ver nuestro trabajo', primary_cta_url: '#work',
        secondary_cta_label: 'Hablemos', secondary_cta_url: '#contact',
        alignment: 'left', media_type: 'none', media_url: '', overlay_opacity: 0,
        min_height: '90vh', bg_color: '#0a0a0a', text_color: '#ffffff', spacing: { top: 80, bottom: 80 },
      },
    },
    {
      id: 'blk_bld_strip',
      type: 'logo_strip',
      visible: true,
      config: {
        title: '',
        logos: [
          { url: '', alt: 'Cliente A' },
          { url: '', alt: 'Cliente B' },
          { url: '', alt: 'Cliente C' },
          { url: '', alt: 'Cliente D' },
          { url: '', alt: 'Cliente E' },
        ],
        speed: 14,
        bg_color: '#0a0a0a',
        logo_height: 32,
        spacing: { top: 0, bottom: 0 },
      },
    },
    {
      id: 'blk_bld_feat',
      type: 'feature_grid',
      visible: true,
      config: {
        title: 'Lo que hacemos',
        subtitle: 'Soluciones integrales para marcas que quieren crecer sin límites.',
        columns: 3, bg_color: '#111111', spacing: { top: 72, bottom: 72 },
        items: [
          { icon: '⚡', title: 'Identidad de Marca', description: 'Creamos marcas memorables que conectan emocionalmente con tu audiencia.', link: '' },
          { icon: '🎯', title: 'Estrategia Digital', description: 'Planificación data-driven para maximizar cada punto de contacto con tu cliente.', link: '' },
          { icon: '🔥', title: 'Desarrollo Web', description: 'Experiencias digitales rápidas, accesibles y que convierten visitas en clientes.', link: '' },
        ],
      },
    },
    {
      id: 'blk_bld_stats',
      type: 'stats',
      visible: true,
      config: {
        title: '',
        subtitle: '',
        bg_color: '#0a0a0a',
        text_color: '#ffffff',
        columns: 3,
        spacing: { top: 72, bottom: 72 },
        items: [
          { value: '+120', label: 'Proyectos entregados' },
          { value: '98%', label: 'Clientes satisfechos' },
          { value: '5x', label: 'ROI promedio' },
        ],
      },
    },
    {
      id: 'blk_bld_cta',
      type: 'cta_banner',
      visible: true,
      config: {
        title: '¿Listo para destacar?',
        description: 'Trabajemos juntos en tu próximo proyecto. El primer paso es una conversación.',
        primary_cta_label: 'Empezar ahora', primary_cta_url: '#contact',
        secondary_cta_label: '', secondary_cta_url: '',
        bg_color: '#ff3c00', text_color: '#ffffff', bg_image_url: '', overlay_opacity: 0,
        spacing: { top: 80, bottom: 80 },
      },
    },
    {
      id: 'blk_bld_ftr',
      type: 'footer',
      visible: true,
      config: {
        bg_color: '#0a0a0a', text_color: 'rgba(255,255,255,0.4)',
        copyright: `© ${new Date().getFullYear()} Agencia. Todos los derechos reservados.`,
        columns: [
          { heading: 'Servicios', links: [{ label: 'Branding', url: '#' }, { label: 'Web', url: '#' }, { label: 'Estrategia', url: '#' }] },
          { heading: 'Empresa', links: [{ label: 'Nosotros', url: '#about' }, { label: 'Contacto', url: '#contact' }] },
        ],
        social_links: [], newsletter_enabled: false, newsletter_placeholder: 'tu@email.com', newsletter_btn_label: 'Suscribirse', logo_url: '', brand_name: '', tagline: '',
      },
    },
  ],
};
