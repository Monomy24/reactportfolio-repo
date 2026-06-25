import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef
} from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-zinc-800 bg-zinc-950/95 p-6 flex flex-col items-center justify-center gap-4 shadow-2xl shadow-black/80 transform-3d will-change-transform backface-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

// Re-engineered to render pure inline vector grids natively without external network CDNs
export const renderIconSVG = (code: string) => {
  const clean = (code || '').toLowerCase().trim();
  
  if (clean === 'react') {
    return (
      <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 841.9 714.6" fill="currentColor">
        <path d="M666.3 296.5c-6.9-25.2-19.1-47.8-35.4-66.8 12.3-25.5 17-48.4 12.8-66-6.1-25.4-23.9-42.5-50.2-48.1-23.7-5-53.5-.2-87.1 14-38.3-23.5-80-36.9-124-39.7-.8-28.2-3.1-55.5-6.9-80.3C369.3 3.9 351 .2 331.4.2c-23.2 0-45.7 5.1-64.8 14.8-19.5 9.9-34 25.1-42 44-12.7 29.8-10.3 68.3 5.4 111.4-30.1 16.9-57.7 38.3-81.8 63.3-24.1-13-48.5-19.1-70.6-17.2-25.5 2.2-46.7 15.6-58 36.7-10.4 19.3-11.8 45.4-4 75.3 11 41.9 33.7 85.3 65.5 125.7-1.4 11-2.2 22.2-2.2 33.6 0 11.1.8 22 2.1 32.7-33 41.1-56.5 85.3-67.6 128.2-10.7 41.3-4.2 73 18.2 89.1 11.2 8 25.1 12.1 41.1 12.1 22.3 0 49.3-7.9 78.4-24 25.1 26 54.4 47.9 86.9 65-12.8 35.7-18.7 68.1-16.7 93.8 2 25.5 13 46.4 31.7 57.5 10.9 6.5 23.8 9.9 38.1 9.9 29.8 0 65.1-14.7 101.4-42.6 39.4 11.1 80.9 16.8 123.6 16.8 42.1 0 83-5.5 121.8-16.3 34.6 26.6 68.1 40.7 96.8 40.7 14 0 26.5-3.3 37.1-9.7 18.6-11 29.4-31.7 31.2-56.8 1.8-25.3-4.1-57.1-16.6-92.2 32.1-16.9 61.1-38.4 86-63.9 30 16 57.8 23.9 80.8 23.9 14.6 0 27.2-3.2 37.2-9.7 22.3-14.4 30-44.5 22.1-87.1-8.9-48.3-33-97.5-69.7-142.1 1.4-11.7 2.1-23.6 2.1-35.6 0-11.5-.7-22.9-1.9-34.2 34.1-42.3 58.3-88.3 70.1-133.3 7.8-30.1 5.9-56-5.4-75.1zm-440 241c0-19.1 15.5-34.6 34.6-34.6s34.6 15.5 34.6 34.6-15.5 34.6-34.6 34.6-34.6-15.5-34.6-34.6z"/>
      </svg>
    );
  }
  if (clean === 'ts' || clean === 'typescript') {
    return (
      <div className="w-8 h-8 bg-blue-600 text-white rounded font-sans font-bold flex items-center justify-center text-sm select-none shadow-sm">
        TS
      </div>
    );
  }
  if (clean === 'tailwind' || clean === 'tailwindcss') {
    return (
      <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479L12 21zm0 0L5.84 10.578a12.083 12.083 0 00-.665 6.479L12 21z" />
      </svg>
    );
  }
  if (clean === 'js' || clean === 'javascript') {
    return (
      <div className="w-8 h-8 bg-amber-400 text-black rounded font-sans font-black flex items-center justify-center text-xs select-none shadow-sm">
        JS
      </div>
    );
  }
  if (clean === 'node' || clean === 'nodejs') {
    return (
      <div className="w-8 h-8 bg-emerald-600 text-white rounded font-sans font-bold flex items-center justify-center text-xs select-none shadow-sm">
        NODE
      </div>
    );
  }

  // Default neat global terminal generic asset fallback box matrix
  return (
    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded font-mono font-bold flex items-center justify-center text-[10px] select-none uppercase">
      {clean.substring(0, 4)}
    </div>
  );
};

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 240,
  height = 200,
  cardDistance = 15,
  verticalDistance = 15,
  delay = 3500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = -4,
  easing = 'elastic',
  children
}) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.2,
          durMove: 0.8,
          durReturn: 1.2,
          promoteOverlap: 0.8,
          returnDelay: 0.1
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.6,
          durMove: 0.5,
          durReturn: 0.6,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        }, [easing]);

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const order = useRef<number[]>([]);

  useEffect(() => {
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
  }, [childArr.length]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refs.length === 0) return;
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=400',
        opacity: 0,
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.1}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          opacity: 1,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
        };
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, config, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={container} className="relative overflow-visible" style={{ width, height }}>
      {rendered}
    </div>
  );
};
