import { useRef } from 'react';

interface UseListDndOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

/**
 * Custom HTML5 DnD hook for vertical list reordering.
 * Returns a factory that produces drag event handlers per list item index.
 */
export function useListDnd({ onReorder }: UseListDndOptions) {
  const fromRef = useRef<number | null>(null);
  const indicatorRef = useRef<HTMLElement | null>(null);

  function clearIndicator() {
    if (indicatorRef.current) {
      indicatorRef.current.style.setProperty('--dnd-indicator', 'none');
      indicatorRef.current = null;
    }
  }

  function getHandlers(index: number, element?: HTMLElement | null) {
    return {
      draggable: true as const,
      onDragStart: (e: React.DragEvent) => {
        fromRef.current = index;
        e.dataTransfer.effectAllowed = 'move';
        // Slight transparency while dragging
        setTimeout(() => {
          if (element) element.style.opacity = '0.4';
        }, 0);
      },
      onDragEnd: (e: React.DragEvent) => {
        if (element) element.style.opacity = '1';
        fromRef.current = null;
        clearIndicator();
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const target = e.currentTarget as HTMLElement;
        clearIndicator();
        const rect = target.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        target.style.setProperty('--dnd-indicator', e.clientY < mid ? 'top' : 'bottom');
        indicatorRef.current = target;
      },
      onDragLeave: () => {
        clearIndicator();
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        clearIndicator();
        const from = fromRef.current;
        if (from === null || from === index) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const to = e.clientY < mid ? index : index + (from < index ? 0 : 1);
        if (from !== to) onReorder(from, Math.max(0, to));
        fromRef.current = null;
      },
    };
  }

  return { getHandlers };
}
