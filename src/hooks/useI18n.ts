import { useState, useEffect } from 'react';
import { type Lang, type TranslationKey, getTranslations } from '../lib/i18n';

const STORAGE_KEY = 'landit-lang';

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      // localStorage not available
    }
    return 'es';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage not available
    }
  }, [lang]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  const t = (key: TranslationKey | string): string => {
    const translations = getTranslations(lang);
    const value = (translations as Record<string, string>)[key];
    return typeof value === 'string' ? value : key;
  };

  return { lang, setLang, t };
}
