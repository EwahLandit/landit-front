import { useState, useEffect } from 'react';
import { type Lang, type TranslationKey, getTranslations } from '../lib/i18n';

const STORAGE_KEY = 'landit-lang';
const FADE_DURATION = 180; // ms — fade-out before lang actually switches

// ── Module-level global state (shared across all hook instances) ───────────

let _lang: Lang = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored as Lang;
  } catch { /* no localStorage */ }
  return 'es';
})();

const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach(fn => fn());
}

function _setLang(newLang: Lang) {
  if (newLang === _lang) return;

  // Trigger CSS fade-out on all animatable text elements
  document.documentElement.setAttribute('data-lang-changing', '');

  setTimeout(() => {
    _lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch { /* ok */ }
    _notify();

    // Two rAF ticks → ensure DOM has updated before starting fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.removeAttribute('data-lang-changing');
      });
    });
  }, FADE_DURATION);
}

// Initialise data-lang attribute synchronously on module load
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-lang', _lang);
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useI18n() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const notify = () => rerender(n => n + 1);
    _listeners.add(notify);
    return () => { _listeners.delete(notify); };
  }, []);

  const setLang = (newLang: Lang) => _setLang(newLang);

  const t = (key: TranslationKey | string): string => {
    const translations = getTranslations(_lang);
    const value = (translations as Record<string, string>)[key];
    return typeof value === 'string' ? value : key;
  };

  return { lang: _lang, setLang, t };
}
