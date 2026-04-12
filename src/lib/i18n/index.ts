import { translations as esTranslations } from './es';
import { translations as enTranslations } from './en';

export type { TranslationKey } from './es';

export type Lang = 'es' | 'en';

export interface I18nManager {
  lang: Lang;
  t: (key: TranslationKey) => string;
  setLang: (lang: Lang) => void;
}

export function getTranslations(lang: Lang): typeof esTranslations {
  return lang === 'en' ? (enTranslations as typeof esTranslations) : esTranslations;
}
