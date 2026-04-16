import type React from 'react';

export type Viewport = 'desktop' | 'mobile';

export interface BlockInstance {
  id: string;
  type: string;
  visible: boolean;
  config: Record<string, unknown>;
  mobile_config?: Record<string, unknown>;
}

export interface SiteMeta {
  title: string;
  favicon: string | null;
  seo: {
    meta_title: string;
    meta_description: string;
    og_image: string | null;
  };
}

export interface Theme {
  accent: string;
  bg: string;
  text: string;
  font_display: string;
  font_body: string;
}

export interface SiteContentV2 {
  schema_version: 2;
  site: SiteMeta;
  theme: Theme;
  blocks: BlockInstance[];
}

// ── Config field schema ────────────────────────────────────────────────────

export type ConfigFieldKind =
  | 'text' | 'textarea' | 'number' | 'toggle' | 'select'
  | 'color' | 'image' | 'richtext' | 'url' | 'repeater'
  | 'group' | 'spacing' | 'font';

interface ConfigFieldBase {
  key: string;
  label: string;
  kind: ConfigFieldKind;
  description?: string;
  section?: string; // Plain Spanish group name. Rendered as a section header in ConfigPanel.
}

export interface TextField extends ConfigFieldBase { kind: 'text'; placeholder?: string; }
export interface TextAreaField extends ConfigFieldBase { kind: 'textarea'; rows?: number; }
export interface NumberField extends ConfigFieldBase { kind: 'number'; min?: number; max?: number; step?: number; }
export interface ToggleField extends ConfigFieldBase { kind: 'toggle'; }
export interface SelectField extends ConfigFieldBase { kind: 'select'; options: { value: string; label: string }[]; }
export interface ColorField extends ConfigFieldBase { kind: 'color'; }
export interface ImageField extends ConfigFieldBase { kind: 'image'; recommendedSize?: string; }
export interface RichTextField extends ConfigFieldBase { kind: 'richtext'; }
export interface UrlField extends ConfigFieldBase { kind: 'url'; placeholder?: string; }
export interface RepeaterField extends ConfigFieldBase {
  kind: 'repeater';
  fields: ConfigFieldSchema[];
  addLabel?: string;
  maxItems?: number;
}
export interface GroupField extends ConfigFieldBase {
  kind: 'group';
  fields: ConfigFieldSchema[];
}
export interface SpacingField extends ConfigFieldBase { kind: 'spacing'; }
export interface FontField extends ConfigFieldBase { kind: 'font'; options?: { value: string; label: string }[]; }

export type ConfigFieldSchema =
  | TextField | TextAreaField | NumberField | ToggleField | SelectField
  | ColorField | ImageField | RichTextField | UrlField | RepeaterField
  | GroupField | SpacingField | FontField;

// ── Block definition ───────────────────────────────────────────────────────

export type BlockCategory = 'layout' | 'content' | 'media' | 'commerce' | 'social' | 'form' | 'utility';

export interface BlockDefinition<C = Record<string, unknown>> {
  type: string;
  category: BlockCategory;
  label: string;        // i18n key
  description: string;  // i18n key
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  defaultConfig: C;
  defaultMobileConfig?: Partial<C>;
  schema: ConfigFieldSchema[];
  mobileSchema?: ConfigFieldSchema[];
  Component: React.FC<{
    config: C;
    mobileConfig?: Partial<C>;
    viewport: Viewport;
    blockId: string;
  }>;
}

// ── Editor state ───────────────────────────────────────────────────────────

export interface EditorState {
  site: SiteMeta;
  theme: Theme;
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  viewport: Viewport;
  libraryOpen: boolean;
  dirty: boolean;
  saving: boolean;
}
