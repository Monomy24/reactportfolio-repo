// src/components/ui/PixelImageTransition.tsx

import React, { useRef, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  intervalDuration?: number; // 🚀 AUTOMATED SLIDE TIMER
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

export const PixelImageTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = '#ffffff',
  animationStepDuration = 0.3,
  intervalDuration = 1500, // Transitions exactly every 1.5 seconds
  aspectRatio = '100%',
  className = '',
  style = {}
}) => {
  /* ==========================================================================
     1. ARCHITECTURAL ENGINE STATE & CONTAINER REFS
     ========================================================================== */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  /* ==========================================================================
     2. GRID MATRIX GENERATOR SUBSYSTEM
     ========================================================================== */
  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    // Flush old nodes to clean memory tracking states before building grids
    pixelGridEl.innerHTML = '';

    // Generate responsive overlay divisions based on gridSize scales
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.classList.add('absolute', 'hidden');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  /* ==========================================================================
     3. HIGH PERFORMANCE STAGGER ROTATION ENGINE
     ========================================================================== */
  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');
    if (!pixels.length) return;

    // Instantly kill running loops to prevent frame collisions
    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: 'none' });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    // STAGE A: Randomized pixelation cover wipe
    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });

    // STAGE B: Mid-timeline source asset context swap
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
      activeEl.style.pointerEvents = activate ? 'none' : '';
    });

    // STAGE C: Randomized pixelation clear wipe
    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });
  };

  /* ==========================================================================
     4. AUTOMATED LIFECYCLE CONTROLLER INTERVAL LOOPS
     ========================================================================== */
  useEffect(() => {
    // If no second profile photo is supplied, maintain static state for image A
    if (!secondContent) return;

    let toggleState = false;

    // Run the animation wipe automatically using a stable background interval
    const loopInterval = setInterval(() => {
      toggleState = !toggleState;
      animatePixels(toggleState);
    }, intervalDuration + (animationStepDuration * 2000)); // Appends duration padding to align timelines

    return () => {
      clearInterval(loopInterval);
      if (delayedCallRef.current) delayedCallRef.current.kill();
    };
  }, [secondContent, intervalDuration, animationStepDuration]);

  /* ==========================================================================
     5. DYNAMIC MARKUP RENDER ASSEMBLY
     ========================================================================== */
  return (
    <div
      ref={containerRef}
      className={`
        ${className}
        relative
        overflow-hidden
        w-full
        h-full
      `.trim()}
      style={style}
    >
      <div style={{ paddingTop: aspectRatio }} />

      {/* Primary Base Layer Asset Container */}
      <div className="absolute inset-0 w-full h-full" aria-hidden={isActive}>
        {firstContent}
      </div>

      {/* Secondary Dynamic Target Layer Container */}
      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'none' }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      {/* High density pixelated matrix overlay channel block */}
      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
    </div>
  );
};
