import { useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';
import { apiSubmitForm } from '../../lib/api';

interface FormField { type: 'text' | 'email' | 'tel' | 'textarea'; label: string; required: boolean; }
interface ContactFormConfig { title: string; description: string; fields: FormField[]; submit_label: string; submit_loading_label: string; success_message: string; redirect_url: string; bg_color: string; spacing: { top: number; bottom: number }; }

function ContactFormComponent({ config, blockId }: { config: ContactFormConfig; viewport: string; blockId: string; mobileConfig?: unknown }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const slug = window.location.pathname.split('/').filter(Boolean).pop() ?? '';
    const result = await apiSubmitForm(slug, blockId, values as Record<string, unknown>);
    setLoading(false);
    if ('error' in result) { setError(result.error); return; }
    if (config.redirect_url) { window.location.href = config.redirect_url; return; }
    setSent(true);
  }

  const fields = config.fields ?? [{ type: 'text', label: 'Nombre', required: true }, { type: 'email', label: 'Email', required: true }, { type: 'textarea', label: 'Mensaje', required: true }];

  return (
    <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px 40px ${config.spacing?.bottom ?? 64}px` }}>
      <style>{`.cf-input{width:100%;padding:10px 14px;background:var(--bg);border:1.5px solid var(--border-strong,rgba(0,0,0,.14));border-radius:10px;font-size:.88rem;font-family:var(--font-body);color:var(--text);outline:none;transition:border-color .15s;box-sizing:border-box;resize:vertical}.cf-input:focus{border-color:var(--accent)}.cf-label{display:block;font-size:.72rem;font-family:var(--font-display);font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:5px}`}</style>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text)', margin: '0 0 10px', textAlign: 'center' }}>{config.title}</h2>}
        {config.description && <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', opacity: .75, textAlign: 'center', marginBottom: 32 }}>{config.description}</p>}
        {sent ? (
          <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-alt,#fff)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><polyline points="20 6 9 17 4 12"/></svg>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>{config.success_message || '¡Mensaje enviado!'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map((f, i) => (
              <div key={i}>
                <label className="cf-label">{f.label}{f.required ? ' *' : ''}</label>
                {f.type === 'textarea'
                  ? <textarea className="cf-input" rows={4} required={f.required} value={values[f.label] ?? ''} onChange={e => setValues(v => ({ ...v, [f.label]: e.target.value }))} />
                  : <input className="cf-input" type={f.type} required={f.required} value={values[f.label] ?? ''} onChange={e => setValues(v => ({ ...v, [f.label]: e.target.value }))} />
                }
              </div>
            ))}
            {error && <p style={{ color: '#e55', fontSize: '.82rem' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '13px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', cursor: loading ? 'default' : 'pointer', marginTop: 4, opacity: loading ? .7 : 1 }}>{loading ? (config.submit_loading_label || 'Enviando…') : (config.submit_label || 'Enviar')}</button>
          </form>
        )}
      </div>
    </section>
  );
}

const def: BlockDefinition<ContactFormConfig> = {
  type: 'contact_form',
  category: 'form',
  label: 'Formulario de contacto',
  description: 'Formulario personalizable con envío a base de datos.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  defaultConfig: { title: 'Contáctanos', description: '', submit_label: 'Enviar mensaje', submit_loading_label: 'Enviando…', success_message: '¡Gracias! Te responderemos pronto.', redirect_url: '', bg_color: '', spacing: { top: 64, bottom: 64 }, fields: [{ type: 'text', label: 'Nombre', required: true }, { type: 'email', label: 'Email', required: true }, { type: 'textarea', label: 'Mensaje', required: true }] },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'description', label: 'Descripción', kind: 'textarea', rows: 2, section: 'Contenido' },
    { key: 'fields', label: 'Campos', kind: 'repeater', fields: [{ key: 'label', label: 'Etiqueta', kind: 'text' }, { key: 'type', label: 'Tipo', kind: 'select', options: [{ value: 'text', label: 'Texto' }, { value: 'email', label: 'Email' }, { value: 'tel', label: 'Teléfono' }, { value: 'textarea', label: 'Área de texto' }] }, { key: 'required', label: 'Obligatorio', kind: 'toggle' }], addLabel: 'Agregar campo', section: 'Contenido' },
    { key: 'submit_label', label: 'Texto del botón', kind: 'text', section: 'Formulario' },
    { key: 'submit_loading_label', label: 'Texto mientras envía', kind: 'text', section: 'Formulario' },
    { key: 'success_message', label: 'Mensaje de éxito', kind: 'text', section: 'Formulario' },
    { key: 'redirect_url', label: 'Redirigir a URL tras envío (opcional)', kind: 'url', section: 'Formulario' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ContactFormComponent as BlockDefinition<ContactFormConfig>['Component'],
};
registerBlock(def);
export default def;
