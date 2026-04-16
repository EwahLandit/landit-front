import type { SiteContentV2, SiteMeta, Theme, BlockInstance } from './types';

const DEFAULT_SITE: SiteMeta = {
  title: '',
  favicon: null,
  seo: { meta_title: '', meta_description: '', og_image: null },
};

const DEFAULT_THEME: Theme = {
  accent: '#0057ff',
  bg: '#ffffff',
  text: '#111111',
  font_display: 'Syne',
  font_body: 'DM Sans',
};

function makeId(): string {
  return `blk_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
}

/**
 * Converts any stored content shape into SiteContentV2.
 * - Already v2: returned as-is.
 * - v1 flat shape: best-effort mapping to block array.
 * - Unknown / empty: returns blank v2.
 */
export function migrateContent(raw: unknown): SiteContentV2 {
  if (!raw || typeof raw !== 'object') {
    return { schema_version: 2, site: DEFAULT_SITE, theme: DEFAULT_THEME, blocks: [] };
  }

  const r = raw as Record<string, unknown>;

  if (r.schema_version === 2 && Array.isArray(r.blocks)) {
    return raw as SiteContentV2;
  }

  const hidden: string[] = Array.isArray(r.hidden_sections) ? (r.hidden_sections as string[]) : [];
  const blocks: BlockInstance[] = [];

  if (r.brand_name || r.accent_color) {
    blocks.push({
      id: makeId(),
      type: 'header',
      visible: true,
      config: {
        brand_name: r.brand_name ?? '',
        bg_color: '#ffffff',
        text_color: '#111111',
        logo_size: 'medium',
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
        nav_links: [],
      },
    });
  }

  if (r.hero_title || r.hero_subtitle) {
    blocks.push({
      id: makeId(),
      type: 'hero',
      visible: !hidden.includes('hero'),
      config: {
        eyebrow: '',
        title: r.hero_title ?? '',
        subtitle: r.hero_subtitle ?? '',
        primary_cta_label: r.hero_cta ?? '',
        primary_cta_url: '',
        secondary_cta_label: r.hero_secondary_cta ?? '',
        secondary_cta_url: '',
        alignment: 'center',
        media_type: 'none',
        media_url: '',
        overlay_opacity: 0,
        min_height: '80vh',
      },
    });
  }

  if (r.features_title || Array.isArray(r.features)) {
    blocks.push({
      id: makeId(),
      type: 'feature_grid',
      visible: !hidden.includes('features'),
      config: {
        title: r.features_title ?? '',
        columns: 3,
        items: Array.isArray(r.features) ? r.features : [],
      },
    });
  }

  if (r.about_title || r.about_text) {
    blocks.push({
      id: makeId(),
      type: 'text_image',
      visible: !hidden.includes('about'),
      config: {
        image_side: 'right',
        title: r.about_title ?? '',
        text: r.about_text ?? '',
        cta_label: '',
        cta_url: '',
        image_url: '',
      },
    });
  }

  if (r.cta_section_title) {
    blocks.push({
      id: makeId(),
      type: 'cta_banner',
      visible: !hidden.includes('cta'),
      config: {
        title: r.cta_section_title ?? '',
        description: r.cta_section_text ?? '',
        primary_cta_label: r.cta_section_btn ?? '',
        primary_cta_url: '',
      },
    });
  }

  if (r.footer_text) {
    blocks.push({
      id: makeId(),
      type: 'footer',
      visible: true,
      config: {
        copyright: r.footer_text ?? '',
        columns: [],
        social_links: [],
        newsletter_enabled: false,
      },
    });
  }

  const theme: Theme = {
    accent: typeof r.accent_color === 'string' ? r.accent_color : DEFAULT_THEME.accent,
    bg: DEFAULT_THEME.bg,
    text: DEFAULT_THEME.text,
    font_display: DEFAULT_THEME.font_display,
    font_body: DEFAULT_THEME.font_body,
  };

  return {
    schema_version: 2,
    site: {
      title: typeof r.brand_name === 'string' ? r.brand_name : '',
      favicon: null,
      seo: { meta_title: '', meta_description: '', og_image: null },
    },
    theme,
    blocks,
  };
}
