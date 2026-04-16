import type { SiteContentV2 } from '../types';
import { blankPreset } from './blank';
import { modernPreset } from './modern';
import { minimalPreset } from './minimal';
import { boldPreset } from './bold';

export interface PresetMeta {
  id: string;
  label: string;
  description: string;
  thumbnail: string | null;
  preset: SiteContentV2;
}

export const PRESETS: PresetMeta[] = [
  {
    id: 'blank',
    label: 'En blanco',
    description: 'Comienza desde cero y construye tu página bloque a bloque.',
    thumbnail: null,
    preset: blankPreset,
  },
  {
    id: 'modern',
    label: 'Moderno',
    description: 'SaaS o producto digital con hero centrado y sección de características.',
    thumbnail: null,
    preset: modernPreset,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Portfolio limpio y tipográfico. Ideal para freelancers y creativos.',
    thumbnail: null,
    preset: minimalPreset,
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Agencia o marca con personalidad fuerte, fondo oscuro y acento vibrante.',
    thumbnail: null,
    preset: boldPreset,
  },
];

export { blankPreset, modernPreset, minimalPreset, boldPreset };
