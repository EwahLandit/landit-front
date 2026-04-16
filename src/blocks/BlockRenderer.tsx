import { useId } from 'react';
import type { BlockInstance, Theme, Viewport } from './types';
import { getBlock } from './registry';
import { buildFontLink, CURATED_FONTS } from './controls/fonts';

interface BlockRendererProps {
  blocks: BlockInstance[];
  theme: Theme;
  viewport: Viewport;
  editorMode?: boolean;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
}

function MissingBlock({ type }: { type: string }) {
  return (
    <div style={{
      padding: '24px 32px',
      background: 'rgba(255,80,80,.05)',
      border: '1px dashed rgba(255,80,80,.25)',
      borderRadius: 8,
      textAlign: 'center',
      color: '#aaa',
      fontFamily: 'monospace',
      fontSize: '0.78rem',
      margin: '8px 0',
    }}>
      Bloque «{type}» no registrado
    </div>
  );
}

function themeToScopedVars(theme: Theme, scopeId: string): string {
  return `
    [data-br-scope="${scopeId}"] {
      --accent: ${theme.accent};
      --bg: ${theme.bg};
      --text: ${theme.text};
      --font-display: '${theme.font_display}', sans-serif;
      --font-body: '${theme.font_body}', sans-serif;
      background: ${theme.bg};
      color: ${theme.text};
    }
  `;
}

export default function BlockRenderer({
  blocks,
  theme,
  viewport,
  editorMode = false,
  hoveredBlockId,
  onHoverBlock,
}: BlockRendererProps) {
  const visibleBlocks = editorMode ? blocks : blocks.filter(b => b.visible);
  const scopeId = useId().replace(/[:]/g, '');
  const fontsToLoad = [theme.font_display, theme.font_body].filter(f =>
    CURATED_FONTS.some(c => c.value === f),
  );
  const fontHref = fontsToLoad.length > 0 ? buildFontLink(fontsToLoad) : null;

  return (
    <div data-br-scope={scopeId}>
      <style>{themeToScopedVars(theme, scopeId)}</style>
      {fontHref && <link rel="stylesheet" href={fontHref} />}
      <style>{`
        @keyframes br-block-enter {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        [data-br-scope] > .br-block-wrap {
          animation: br-block-enter .25s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        /* ── block wrapper ── */
        .br-block-wrap { position: relative; }

        /* transparent overlay that blocks all interactions in editor mode */
        .br-block-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: default;
        }

        /* hover highlight ring — always present, fades in/out */
        .br-block-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 12;
          border: 2px solid var(--accent, #0057ff);
          border-radius: 2px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .18s cubic-bezier(0.22,1,0.36,1),
                      box-shadow .18s cubic-bezier(0.22,1,0.36,1);
        }
        .br-block-wrap.br-hovered::after {
          opacity: 1;
          box-shadow: inset 0 0 0 2000px rgba(0,87,255,.025),
                      0 0 0 4px rgba(0,87,255,.10);
        }

        /* ── hidden block tint ── */
        .br-hidden-tint {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.55);
          z-index: 2;
          pointer-events: none;
          transition: background .2s cubic-bezier(0.22,1,0.36,1);
        }
        .br-block-wrap.br-hovered .br-hidden-tint {
          background: rgba(0,0,0,.40);
        }
        .br-hidden-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 13;
          background: rgba(0,0,0,.75);
          color: #fff;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: .62rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: var(--radius-full, 9999px);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }
        .br-hidden-badge svg { width: 12px; height: 12px; }
      `}</style>

      {visibleBlocks.map(block => {
        const def = getBlock(block.type);
        if (!def) return <MissingBlock key={block.id} type={block.type} />;

        const { Component } = def;
        const inner = (
          <Component
            blockId={block.id}
            config={block.config as never}
            mobileConfig={block.mobile_config as never}
            viewport={viewport}
          />
        );

        const isHidden = editorMode && !block.visible;
        const isHovered = editorMode && hoveredBlockId === block.id;

        return (
          <div
            key={block.id}
            className={`br-block-wrap${isHovered ? ' br-hovered' : ''}`}
          >
            {editorMode && (
              <div
                className="br-block-overlay"
                onMouseEnter={() => onHoverBlock?.(block.id)}
                onMouseLeave={() => onHoverBlock?.(null)}
              />
            )}
            {isHidden && (
              <>
                <div className="br-hidden-tint" />
                <span className="br-hidden-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  Oculto
                </span>
              </>
            )}
            {inner}
          </div>
        );
      })}
    </div>
  );
}
