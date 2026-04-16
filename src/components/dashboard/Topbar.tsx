import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title?: string;
  trialBanner?: React.ReactNode;
}

export default function Topbar({ title, trialBanner }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <div className="topbar" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
      {/* Trial banner — ocupa el espacio central */}
      {trialBanner && (
        <div style={{ flex: 1, margin: '0 12px' }}>
          {trialBanner}
        </div>
      )}

      {/* Spacer si no hay banner */}
      {!trialBanner && <div style={{ flex: 1 }} />}

      {/* Theme toggle */}
      <button
        className="btn btn--ghost"
        onClick={toggle}
        aria-label={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}
        style={{ flexShrink: 0 }}
      >
        {theme === 'light' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
      </button>
    </div>
  );
}
