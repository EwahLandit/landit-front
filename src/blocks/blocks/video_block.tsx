import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface VideoConfig { url: string; autoplay: boolean; loop: boolean; muted: boolean; poster_url: string; title: string; spacing: { top: number; bottom: number }; }

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

const def: BlockDefinition<VideoConfig> = {
  type: 'video_block',
  category: 'media',
  label: 'Video',
  description: 'Video auto-hospedado o embed de YouTube / Vimeo.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  defaultConfig: { url: '', autoplay: false, loop: false, muted: true, poster_url: '', title: '', spacing: { top: 32, bottom: 32 } },
  schema: [
    { key: 'url', label: 'URL del video', kind: 'url', description: 'URL directa de video, YouTube o Vimeo.', section: 'Contenido' },
    { key: 'title', label: 'Título (opcional)', kind: 'text', section: 'Contenido' },
    { key: 'poster_url', label: 'Imagen de portada', kind: 'image', section: 'Contenido' },
    { key: 'autoplay', label: 'Reproducción automática', kind: 'toggle', section: 'Reproducción' },
    { key: 'loop', label: 'Repetir', kind: 'toggle', section: 'Reproducción' },
    { key: 'muted', label: 'Sin sonido', kind: 'toggle', section: 'Reproducción' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: ({ config }) => {
    const embed = getEmbedUrl(config.url);
    return (
      <div style={{ padding: `${config.spacing?.top ?? 32}px 40px ${config.spacing?.bottom ?? 32}px` }}>
        {config.title && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: 16, textAlign: 'center' }}>{config.title}</h3>}
        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
          {embed ? (
            <iframe src={embed} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={config.title || 'video'} />
          ) : config.url ? (
            <video src={config.url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} autoPlay={config.autoplay} loop={config.loop} muted={config.muted} poster={config.poster_url} controls />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted,#999)', fontSize: '.85rem', background: 'var(--border,rgba(0,0,0,.06))' }}>Agrega la URL de un video</div>
          )}
        </div>
      </div>
    );
  },
};
registerBlock(def);
export default def;
