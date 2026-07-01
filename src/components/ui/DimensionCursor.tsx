import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { gsap } from 'gsap';

const isInteractiveElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('a, button, input, textarea, select, label, [role="button"], [role="link"]') ||
      target.classList.contains('cursor-pointer')
  );
};

export const DimensionCursor: React.FC = () => {
  const { currentDimension, hoveredDimension } = useThemeStore();
  const { isAuthenticated } = usePortfolioStore();
  const activePack = dimensionPacks[hoveredDimension || currentDimension];

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  const moveCursor = useCallback((event: MouseEvent) => {
    if (!cursorRef.current) return;

    const x = event.clientX;
    const y = event.clientY;

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.14,
      ease: 'power3.out'
    });
  }, []);

  const updateHoverState = useCallback((event: MouseEvent | PointerEvent) => {
    setIsHoveredLink(isInteractiveElement(event.target));
  }, []);

  useEffect(() => {
    const checkAdminState = () => {
      const hasAdminHash = window.location.hash === '#admin';
      const adminModalMounted = document.getElementById('adminConsoleOverlayMasterContainer') !== null;
      setIsAdminOverlayOpen(hasAdminHash || adminModalMounted);
    };

    checkAdminState();
    const cursorObserver = new MutationObserver(checkAdminState);
    cursorObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', checkAdminState);

    return () => {
      cursorObserver.disconnect();
      window.removeEventListener('hashchange', checkAdminState);
    };
  }, []);

  useEffect(() => {
    if (isAdminOverlayOpen || isAuthenticated || isMobile) return;

    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('pointerover', updateHoverState);
    window.addEventListener('pointerout', updateHoverState);
    window.addEventListener('mousemove', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', updateHoverState);
      window.removeEventListener('mousemove', updateHoverState);
      document.body.style.cursor = '';
    };
  }, [isAdminOverlayOpen, isAuthenticated, isMobile, moveCursor, updateHoverState]);

  if (isAdminOverlayOpen || isAuthenticated || isMobile) {
    return null;
  }

  const { type, color, glow } = activePack.cursor;

  if (type === 'target') {
    return (
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen w-10 h-10 select-none will-change-transform"
      >
        {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((cls, idx) => (
          <div
            key={idx}
            className={`target-cursor-corner absolute w-3 h-3 transition-colors duration-150 ${cls}`}
            style={{ borderColor: isHoveredLink ? '#B497CF' : color }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={dotRef}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-150"
            style={{ backgroundColor: isHoveredLink ? '#B497CF' : color }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 will-change-transform mix-blend-difference hidden md:block"
      style={{
        backgroundColor: type === 'dot' ? color : 'transparent',
        borderColor: color,
        borderWidth: type === 'dot' ? '0px' : '2px',
        boxShadow: glow,
        width: type === 'dot' ? (isHoveredLink ? 28 : 16) : (isHoveredLink ? 4 : 2),
        height: type === 'dot' ? (isHoveredLink ? 28 : 16) : (isHoveredLink ? 40 : 28),
        borderRadius: type === 'dot' ? '50%' : '4px',
        transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-radius 0.2s, box-shadow 0.2s'
      }}
    />
  );
};
