import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface Step { title: string; description: string; }
interface StepsConfig { title: string; subtitle: string; steps: Step[]; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

const def: BlockDefinition<StepsConfig> = {
  type: 'steps',
  category: 'content',
  label: 'Pasos / Proceso',
  description: 'Lista numerada de pasos o proceso.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  defaultConfig: { title: 'Cómo funciona', subtitle: '', text_color: '', steps: [{ title: 'Regístrate', description: 'Crea tu cuenta en menos de un minuto.' }, { title: 'Configura tu página', description: 'Personaliza cada sección con tu contenido.' }, { title: 'Publica', description: 'Comparte tu sitio con el mundo.' }], bg_color: '', spacing: { top: 64, bottom: 64 } },
  schema: [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'textarea', rows: 2 },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'steps', label: 'Pasos', kind: 'repeater', fields: [{ key: 'title', label: 'Título del paso', kind: 'text' }, { key: 'description', label: 'Descripción', kind: 'textarea', rows: 2 }], addLabel: 'Agregar paso' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing' },
  ],
  Component: ({ config, viewport }) => {
    const isMobile = viewport === 'mobile';
    const tc = config.text_color || 'var(--text)';
    const tcs = config.text_color || 'var(--text-secondary)';
    return (
      <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 24 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
        {(config.title || config.subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: tc, margin: '0 0 12px' }}>{config.title}</h2>}
            {config.subtitle && <p style={{ fontFamily: 'var(--font-body)', color: tcs, opacity: .75, fontSize: '1rem', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>{config.subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640, margin: '0 auto' }}>
          {(config.steps ?? []).map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: tc, margin: '6px 0 6px' }}>{step.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: tcs, fontSize: '.9rem', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
};
registerBlock(def);
export default def;
