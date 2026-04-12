import { useEffect, useRef } from 'react';

const CURSOR_STYLES = `
  .cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width .2s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
      height .2s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
      background .2s, border-color .2s, opacity .2s;
  }

  .cursor-dot {
    position: fixed;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
  }

  .cursor--hover {
    width: 56px;
    height: 56px;
    background: var(--accent-glow, rgba(0, 87, 255, 0.18));
    border-color: transparent;
  }

  @media (hover: none) {
    .cursor,
    .cursor-dot {
      display: none;
    }
  }
`;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .btn')) {
        cursor.classList.add('cursor--hover');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .btn')) {
        cursor.classList.remove('cursor--hover');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      <style>{CURSOR_STYLES}</style>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
