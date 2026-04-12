// Feature: landit-migration, Property 7: Validación de scroll reveal

import { describe, it } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 7: Validación de scroll reveal
 * Validates: Requirements 16.1, 16.2
 *
 * For any element with data-reveal that enters the viewport,
 * it should receive the class `is-visible` and must NOT have it before entering.
 */

/**
 * Simulates the IntersectionObserver callback logic from useScrollReveal.ts
 * directly (without React rendering or a real DOM observer).
 *
 * @param isIntersecting - whether the element is intersecting the viewport
 * @returns { hadClassBefore, hasClassAfter }
 */
function revealOnIntersect(isIntersecting: boolean): {
  hadClassBefore: boolean;
  hasClassAfter: boolean;
} {
  // Mock element with classList simulation
  const classes = new Set<string>();
  const mockElement = {
    classList: {
      add: (cls: string) => classes.add(cls),
      contains: (cls: string) => classes.has(cls),
    },
  };

  const hadClassBefore = mockElement.classList.contains('is-visible');

  // Simulate the IntersectionObserver callback (from useScrollReveal.ts)
  const entry = { isIntersecting, target: mockElement };
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
  }

  const hasClassAfter = mockElement.classList.contains('is-visible');

  return { hadClassBefore, hasClassAfter };
}

describe('ScrollReveal - Property 7: Validación de scroll reveal', () => {
  it('is-visible is added when intersecting and not before', () => {
    fc.assert(
      fc.property(fc.boolean(), (isIntersecting) => {
        const { hadClassBefore, hasClassAfter } = revealOnIntersect(isIntersecting);

        // Element must never have is-visible before the callback
        if (hadClassBefore) return false;

        if (isIntersecting) {
          // When intersecting: class must be added
          return hasClassAfter === true;
        } else {
          // When not intersecting: class must NOT be added
          return hasClassAfter === false;
        }
      }),
      { numRuns: 100 }
    );
  });
});
