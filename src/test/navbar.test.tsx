import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from '../components/landing/Navbar';

// Mock hooks to isolate Navbar logic
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggle: vi.fn() }),
}));

vi.mock('../hooks/useI18n', () => ({
  useI18n: () => ({
    lang: 'es',
    setLang: vi.fn(),
    t: (key: string) => key,
  }),
}));

describe('Navbar', () => {
  beforeEach(() => {
    // Reset scrollY before each test
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Requirements: 6.2 — header--scrolled class when scrollY > 10
  it('applies header--scrolled class when scrollY > 10', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');
    expect(header).not.toHaveClass('header--scrolled');

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 20, writable: true, configurable: true });
      fireEvent.scroll(window);
    });

    expect(header).toHaveClass('header--scrolled');
  });

  // Requirements: 6.4 — hamburger toggles mobile menu
  it('toggles mobile menu open/closed when hamburger is clicked', () => {
    const { container } = render(<Navbar />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    const navLinks = container.querySelector('.nav__links');

    expect(navLinks).not.toHaveClass('is-open');

    fireEvent.click(hamburger);
    expect(navLinks).toHaveClass('is-open');

    fireEvent.click(hamburger);
    expect(navLinks).not.toHaveClass('is-open');
  });
});
