import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  createdAt: number;
}

// ── Variant colors ─────────────────────────────────────────────────────────

const VARIANT_BG: Record<ToastVariant, string> = {
  success: '#00a86b',
  error: '#ff4d4d',
  warning: '#ff9900',
  info: '#0057ff',
};

// ── Context ────────────────────────────────────────────────────────────────

interface ToastContextValue {
  showToast: (message: string, variant: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Hook ───────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

// ── Single Toast component ─────────────────────────────────────────────────

interface ToastProps {
  item: ToastItem;
  onRemove: (id: string) => void;
}

function Toast({ item, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation on mount
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const style: React.CSSProperties = {
    padding: '14px 20px',
    borderRadius: '12px',
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 600,
    boxShadow: '0 16px 48px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)',
    transform: visible ? 'translateX(0)' : 'translateX(120px)',
    opacity: visible ? 1 : 0,
    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s cubic-bezier(0.22,1,0.36,1)',
    pointerEvents: 'auto',
    minWidth: '220px',
    maxWidth: '320px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: VARIANT_BG[item.variant],
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div style={style} role="alert" onClick={() => onRemove(item.id)}>
      {item.message}
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const item: ToastItem = { id, message, variant, createdAt: Date.now() };

      setToasts((prev) => [...prev, item]);

      const timer = setTimeout(() => removeToast(id), 4000);
      timers.current.set(id, timer);
    },
    [removeToast],
  );

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 9999,
    alignItems: 'flex-end',
    pointerEvents: 'none',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={containerStyle} aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
