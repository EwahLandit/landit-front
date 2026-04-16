import type { SiteContentV2 } from '../types';

export const blankPreset: SiteContentV2 = {
  schema_version: 2,
  site: { title: '', favicon: null, seo: { meta_title: '', meta_description: '', og_image: null } },
  theme: { accent: '#0057ff', bg: '#ffffff', text: '#111111', font_display: 'Syne', font_body: 'DM Sans' },
  blocks: [],
};
