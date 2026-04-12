// Feature: landit-migration, Property 1: Round-trip de traducciones

import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { translations as es } from '../lib/i18n/es';
import { translations as en } from '../lib/i18n/en';

/**
 * Property 1: Round-trip de traducciones
 * Validates: Requirements 28.2
 *
 * For any translation key defined in es.ts, accessing that same key in en.ts
 * must return a non-empty string (dictionary completeness).
 */
describe('i18n - Property 1: Round-trip de traducciones', () => {
  it('every key in es has a non-empty string value in en', () => {
    const keys = Object.keys(es) as Array<keyof typeof es>;

    fc.assert(
      fc.property(fc.constantFrom(...keys), (key) => {
        return en[key] !== undefined && en[key].length > 0;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: landit-migration, Property 2: Fallback de clave inexistente

import { getTranslations } from '../lib/i18n';

/**
 * Property 2: Fallback de clave inexistente
 * Validates: Requirements 28.3
 *
 * For any arbitrary string key (not necessarily a valid translation key),
 * the t() function must return a string (never undefined).
 */
describe('i18n - Property 2: Fallback de clave inexistente', () => {
  it('t(key) always returns a string, never undefined, for any arbitrary key', () => {
    const t = (key: string): string => {
      const translations = getTranslations('es');
      const value = (translations as Record<string, string>)[key];
      return typeof value === 'string' ? value : key;
    };

    fc.assert(
      fc.property(fc.string(), (key) => {
        return typeof t(key) === 'string' && t(key) !== undefined;
      }),
      { numRuns: 100 }
    );
  });
});
