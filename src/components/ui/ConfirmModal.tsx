import React from 'react';
import Modal from './Modal';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  };

  const cancelBtnStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
  };

  const confirmBtnStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    border: '1px solid transparent',
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.2s',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div style={footerStyle}>
        <button
          style={cancelBtnStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-alt)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {cancelLabel}
        </button>
        <button
          style={confirmBtnStyle}
          onClick={handleConfirm}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
