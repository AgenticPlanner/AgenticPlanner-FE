import { useState, useEffect, useRef } from 'react';
import type React from 'react';

export interface UsePanelResizeOptions {
  direction: 'horizontal' | 'vertical';
  initialSize: number;
  minSize: number;
  maxSize: number;
  unit?: 'px' | 'percent';
  storageKey?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export interface UsePanelResizeReturn {
  size: number;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export function usePanelResize({
  direction,
  initialSize,
  minSize,
  maxSize,
  unit = 'px',
  storageKey,
  containerRef,
}: UsePanelResizeOptions): UsePanelResizeReturn {
  const [size, setSize] = useState<number>(() => {
    if (storageKey) {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const parsed = Number(raw);
        if (!isNaN(parsed)) return Math.min(maxSize, Math.max(minSize, parsed));
      }
    }
    return initialSize;
  });

  const [isDragging, setIsDragging] = useState(false);

  const draggingRef = useRef(false);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(size);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // Keep latest config in ref so event handlers never go stale
  const configRef = useRef({ direction, unit, minSize, maxSize, storageKey, containerRef });
  configRef.current = { direction, unit, minSize, maxSize, storageKey, containerRef };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSizeRef.current = sizeRef.current;
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    draggingRef.current = true;
    startPosRef.current = direction === 'horizontal' ? touch.clientX : touch.clientY;
    startSizeRef.current = sizeRef.current;
    setIsDragging(true);
  };

  useEffect(() => {
    const computeSize = (pos: number): number => {
      const { direction: dir, unit: u, minSize: min, maxSize: max, containerRef: cRef } =
        configRef.current;
      const delta = pos - startPosRef.current;

      if (u === 'percent') {
        const el = cRef?.current;
        const containerSize = el
          ? dir === 'horizontal'
            ? el.offsetWidth
            : el.offsetHeight
          : dir === 'horizontal'
            ? window.innerWidth
            : window.innerHeight;
        return Math.min(max, Math.max(min, startSizeRef.current + (delta / containerSize) * 100));
      }
      return Math.min(max, Math.max(min, startSizeRef.current + delta));
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const pos = configRef.current.direction === 'horizontal' ? e.clientX : e.clientY;
      const next = computeSize(pos);
      sizeRef.current = next;
      setSize(next);
    };

    const onMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      if (configRef.current.storageKey) {
        localStorage.setItem(configRef.current.storageKey, String(sizeRef.current));
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      const touch = e.touches[0];
      const pos = configRef.current.direction === 'horizontal' ? touch.clientX : touch.clientY;
      const next = computeSize(pos);
      sizeRef.current = next;
      setSize(next);
    };

    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      if (configRef.current.storageKey) {
        localStorage.setItem(configRef.current.storageKey, String(sizeRef.current));
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []); // empty deps — all state accessed via refs

  // Body cursor + user-select during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, direction]);

  return { size, isDragging, handleMouseDown, handleTouchStart };
}
