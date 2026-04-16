import type { ReactNode } from 'react';
import type { ConfigFieldSchema } from '../types';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import NumberField from './NumberField';
import ToggleField from './ToggleField';
import SelectField from './SelectField';
import ColorPicker from './ColorPicker';
import ImageField from './ImageField';
import UrlField from './UrlField';
import SpacingField from './SpacingField';
import RepeaterField from './RepeaterField';
import FontField from './FontField';

/**
 * Maps a ConfigFieldSchema + current value + onChange handler to the
 * appropriate control component. Used by both ConfigPanel and RepeaterField.
 */
export function renderControl(
  field: ConfigFieldSchema,
  value: unknown,
  onChange: (v: unknown) => void,
  websiteId?: number,
): ReactNode {
  const base = { key: field.key, label: field.label, description: field.description };

  switch (field.kind) {
    case 'text':
      return <TextField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} placeholder={field.placeholder} />;

    case 'textarea':
      return <TextAreaField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} rows={field.rows} />;

    case 'number':
      return <NumberField {...base} value={(value as number) ?? 0} onChange={onChange as (v: number) => void} min={field.min} max={field.max} step={field.step} />;

    case 'toggle':
      return <ToggleField {...base} value={(value as boolean) ?? false} onChange={onChange as (v: boolean) => void} />;

    case 'select':
      return <SelectField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} options={field.options} />;

    case 'color':
      return <ColorPicker {...base} value={(value as string) || '#000000'} onChange={onChange as (v: string) => void} />;

    case 'image':
      return <ImageField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} websiteId={websiteId ?? 0} recommendedSize={field.recommendedSize} />;

    case 'url':
      return <UrlField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} placeholder={field.placeholder} />;

    case 'richtext':
      // v1: textarea + markdown preview is out of scope; use plain textarea
      return <TextAreaField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} rows={5} />;

    case 'spacing':
      return <SpacingField {...base} value={(value as { top: number; bottom: number }) ?? { top: 0, bottom: 0 }} onChange={onChange as (v: { top: number; bottom: number }) => void} />;

    case 'repeater':
      return (
        <RepeaterField
          {...base}
          value={(value as Record<string, unknown>[]) ?? []}
          onChange={onChange as (v: Record<string, unknown>[]) => void}
          fields={field.fields}
          addLabel={field.addLabel}
          maxItems={field.maxItems}
          websiteId={websiteId}
        />
      );

    case 'font':
      return <FontField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} />;

    case 'group':
      return (
        <div key={field.key} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '.68rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>
            {field.label}
          </div>
          <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border, rgba(0,0,0,.08))' }}>
            {field.fields.map(f => renderControl(f, (value as Record<string, unknown>)?.[f.key], v => onChange({ ...((value as Record<string, unknown>) ?? {}), [f.key]: v }), websiteId))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
