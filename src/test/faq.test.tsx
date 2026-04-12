import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQSection from '../components/landing/FAQSection';

// Requirements: 12.2 — FAQ accordion: only one question open at a time

describe('FAQSection', () => {
  it('initially has no FAQ answer visible (all collapsed)', () => {
    render(<FAQSection />);
    const buttons = screen.getAllByRole('button');
    // All question buttons should have aria-expanded="false"
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('clicking a question opens its answer', () => {
    render(<FAQSection />);
    const buttons = screen.getAllByRole('button');
    const first = buttons[0];

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking a second question closes the first and opens the second', () => {
    render(<FAQSection />);
    const buttons = screen.getAllByRole('button');
    const first = buttons[0];
    const second = buttons[1];

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking the same open question closes it', () => {
    render(<FAQSection />);
    const buttons = screen.getAllByRole('button');
    const first = buttons[0];

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });
});
