import { useEffect } from 'react';

export function useScrollReveal(): void {
  useEffect(() => {
    const observe = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              // Once visible, stop observing to prevent re-hiding on scroll back
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => {
        const delay = el.getAttribute('data-delay');
        if (delay) {
          el.style.transitionDelay = `${delay}ms`;
        }
        observer.observe(el);
      });

      return observer;
    };

    // Small delay to ensure all React components have rendered
    const timer = setTimeout(() => {
      const observer = observe();
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}
