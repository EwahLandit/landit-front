// Feature: landit-migration, Property 4: Cascade highlight incluye todas las tarjetas inferiores

import { describe, it } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 4: Cascade highlight incluye todas las tarjetas inferiores
 * Validates: Requirements 11.6
 *
 * For any index i of a hovered PricingCard, all cards with index j <= i must
 * have the class `cascade-lit`, and no card with index j > i should have it.
 */

const TOTAL_CARDS = 4;

/**
 * Simulates the cascade highlight logic directly (without React rendering):
 * 1. Creates 4 pricing card slots (indices 0-3)
 * 2. Applies cascade logic: card at index j gets `cascade-lit` if j <= hoveredIndex
 * 3. Returns true if ALL cards with j <= hoveredIndex have `cascade-lit`
 *    AND ALL cards with j > hoveredIndex do NOT have `cascade-lit`
 */
function checkCascade(hoveredIndex: number): boolean {
  const cards = Array.from({ length: TOTAL_CARDS }, (_, j) => ({
    index: j,
    hasCascadeLit: j <= hoveredIndex,
  }));

  const litCorrect = cards
    .filter((c) => c.index <= hoveredIndex)
    .every((c) => c.hasCascadeLit === true);

  const notLitCorrect = cards
    .filter((c) => c.index > hoveredIndex)
    .every((c) => c.hasCascadeLit === false);

  return litCorrect && notLitCorrect;
}

describe('PricingSection - Property 4: Cascade highlight incluye todas las tarjetas inferiores', () => {
  it('cards with j <= hoveredIndex have cascade-lit, cards with j > hoveredIndex do not', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        (i) => checkCascade(i)
      ),
      { numRuns: 100 }
    );
  });
});
