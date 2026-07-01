import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { gsap } from 'gsap';

// UTILITY A: Scans the DOM upward to catch boundary containers
const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

// UTILITY B: Computes precise layout offsets for absolute rendering
const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};
export const DimensionCursor: React.FC = () => {
  const { currentDimension, hoveredDimension } = useThemeStore();
  const { isAuthenticated } = usePortfolioStore();

  const activePack = dimensionPacks[hoveredDimension || currentDimension];
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);

  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  // 🚀 Admin overlay detection
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

  // 🚀 Glitch terminator override
if (isAdminOverlayOpen || isAuthenticated || isMobile) {
  return null;
}

const { type, color, glow } = activePack.cursor;

/* Branch A: Target cursor */
if (type === 'target') {
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen w-10 h-10 select-none will-change-transform"
    >
      {/* Radar Corner Brackets */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2'
      ].map((cls, idx) => (
        <div
          key={idx}
          className={`target-cursor-corner absolute w-3 h-3 transition-colors duration-150 ${cls}`}
          style={{ borderColor: isHoveredLink ? '#B497CF' : color }}
        />
      ))}
      {/* Center Target Pip Tracker */}
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

/* Branch B: Dot/Line cursor */
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
      transition:
        'width 0.2s, height 0.2s, background-color 0.2s, border-radius 0.2s, box-shadow 0.2s'
    }}
  />
);
}
