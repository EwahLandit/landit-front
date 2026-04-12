import React, { useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// ── Styles ─────────────────────────────────────────────────────────────────

const EASE_OUT = 'cubic-bezier(0.22,1,0.36,1)';
const EASE_SPRING = 'cubic-bezier(0.34,1.56,0.64,1)';

// ── Component ──────────────────────────────────────────────────────────────

export default function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: `opacity 0.3s ${EASE_OUT}`,
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
    opacity: isOpen ? 1 : 0,
    transition: `transform 0.4s ${EASE_SPRING}, opacity 0.35s ${EASE_OUT}`,
  };

  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    lineHeight: 1,
    transition: `all 0.2s ${EASE_OUT}`,
    fontFamily: 'inherit',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    marginBottom: description ? '6px' : '24px',
  };

  const descStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginBottom: '24px',
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      style={overlayStyle}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        ref={modalRef}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={closeBtnStyle}
          onClick={onClose}
          aria-label="Cerrar modal"
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = 'var(--bg-alt)';
            btn.style.color = 'var(--text)';
            btn.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = 'none';
            btn.style.color = 'var(--text-muted)';
            btn.style.transform = 'rotate(0deg)';
          }}
        >
          ×
        </button>

        {title && <h2 style={titleStyle}>{title}</h2>}
        {description && <p style={descStyle}>{description}</p>}

        {children}
      </div>
    </div>
  );
}
