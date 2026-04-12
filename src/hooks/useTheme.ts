import { useState, useEffect } from 'react';

const STORAGE_KEY = 'landit-theme';

export type Theme = 'light' | 'dark';

export interface ThemeManager {
  theme: Theme;
  toggle: () => void;
}

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage not available
  }
  // Fall back to system preference
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // matchMedia not available
  }
  return 'light';
}

export function useTheme(): ThemeManager {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage not available
    }
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggle };
}
