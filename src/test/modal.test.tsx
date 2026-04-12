import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';

// ── Modal tests ────────────────────────────────────────────────────────────

describe('Modal', () => {
  it('renders children when isOpen=true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <span>modal content</span>
      </Modal>
    );
    expect(screen.getByText('modal content')).toBeInTheDocument();
  });

  it('has opacity 0 on overlay when isOpen=false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <span>hidden content</span>
      </Modal>
    );
    // The overlay div is the first child; its style should have opacity 0
    const overlay = container.firstChild as HTMLElement;
    expect(overlay.style.opacity).toBe('0');
  });

  it('calls onClose when close button (×) is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /cerrar modal/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when clicking inside modal content', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>inner content</span>
      </Modal>
    );
    fireEvent.click(screen.getByText('inner content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
        <span>content</span>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});

// ── ConfirmModal tests ─────────────────────────────────────────────────────

describe('ConfirmModal', () => {
  it('renders "Cancelar" and "Confirmar" buttons', () => {
    render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
  });

  it('calls onClose when "Cancelar" is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls both onConfirm and onClose when "Confirmar" is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('respects custom confirmLabel and cancelLabel', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        confirmLabel="Sí, eliminar"
        cancelLabel="No, volver"
      />
    );
    expect(screen.getByRole('button', { name: /sí, eliminar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no, volver/i })).toBeInTheDocument();
  });
});
