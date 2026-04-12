// Feature: landit-migration, Property 8: Completitud de tokens CSS
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Validates: Requirements 3.1, 3.2

const tokensPath = resolve(__dirname, '../styles/tokens.css');
const cssText = readFileSync(tokensPath, 'utf-8');

/**
 * Extract the content of the [data-theme="dark"] block from the CSS text.
 */
function extractDarkThemeBlock(css: string): string {
  const match = css.match(/\[data-theme="dark"\]\s*\{([^}]*)\}/s);
  return match ? match[1] : '';
}

const REQUIRED_TOKENS = [
  '--bg',
  '--bg-alt',
  '--bg-card',
  '--text',
  '--text-secondary',
  '--text-muted',
  '--border',
  '--border-strong',
  '--accent-subtle',
  '--shadow-sm',
  '--shadow',
  '--shadow-lg',
] as const;

type RequiredToken = typeof REQUIRED_TOKENS[number];

describe('Property 8: Completitud de tokens CSS', () => {
  const darkBlock = extractDarkThemeBlock(cssText);

  it('el bloque [data-theme="dark"] existe en tokens.css', () => {
    expect(darkBlock.length).toBeGreaterThan(0);
  });

  it('cada token requerido está declarado en [data-theme="dark"]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...REQUIRED_TOKENS),
        (token: RequiredToken) => {
          // Check that the token appears as a CSS custom property declaration
          // e.g. "--bg:" or "--bg-alt:" inside the dark block
          const regex = new RegExp(`${token}\\s*:`);
          return regex.test(darkBlock);
        }
      ),
      { numRuns: 100 }
    );
  });
});
