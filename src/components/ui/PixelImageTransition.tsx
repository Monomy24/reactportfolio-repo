// src/components/ui/PixelImageTransition.tsx
import { useEffect, useRef, useState } from 'react';

interface PixelImageProps {
  img1: string;
  img2?: string;
  interval?: number;
}

export default function PixelImageTransition({ img1, img2, interval = 1500 }: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSource, setActiveSource] = useState(1);
  const imagesRef = useRef<{ [key: number]: HTMLImageElement | null }>({});
  const progressRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Helper: draw image with aspect ratio crop
  const drawImageProp = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const iw = image.width;
    const ih = image.height;

    const r = Math.max(cw / iw, ch / ih);
    const nw = iw * r;
    const nh = ih * r;
    const cx = (iw - cw / r) / 2;
    const cy = (ih - ch / r) / 2;

    ctx.drawImage(image, cx, cy, iw - 2 * cx, ih - 2 * cy, 0, 0, cw, ch);
  };

  // Preload images
  useEffect(() => {
    const loadImg = (key: number, src: string) => {
      if (!src) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => { imagesRef.current[key] = img; };
    };

    loadImg(1, img1);
    if (img2) loadImg(2, img2);
  }, [img1, img2]);

  // Interval trigger
  useEffect(() => {
    if (!img2) {
      setActiveSource(1);
      return;
    }

    const timer = setInterval(() => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      progressRef.current = 0;
    }, interval);

    return () => clearInterval(timer);
  }, [img2, interval]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animId: number;

    const render = () => {
      const img1Obj = imagesRef.current[1];
      const img2Obj = imagesRef.current[2];

      if (!isTransitioningRef.current || !img2Obj || !img1Obj) {
        const currentImg = activeSource === 1 ? img1Obj : img2Obj;
        if (currentImg) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawImageProp(ctx, currentImg);
        }
        animId = requestAnimationFrame(render);
        return;
      }

      progressRef.current += 0.04;
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        isTransitioningRef.current = false;
        setActiveSource(prev => (prev === 1 ? 2 : 1));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fromImg = activeSource === 1 ? img1Obj : img2Obj;
      const toImg = activeSource === 1 ? img2Obj : img1Obj;
      const p = progressRef.current;

      const maxPixelSize = 24;
      const currentPixelSize = Math.max(1, Math.sin(p * Math.PI) * maxPixelSize);

      if (currentPixelSize <= 1) {
        drawImageProp(ctx, p < 0.5 ? fromImg! : toImg!);
      } else {
        drawImageProp(ctx, p < 0.5 ? fromImg! : toImg!);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const size = Math.round(currentPixelSize);
        for (let x = 0; x < canvas.width; x += size) {
          for (let y = 0; y < canvas.height; y += size) {
            const pixelIndex = ((Math.min(y + size / 2, canvas.height - 1) * canvas.width) + Math.min(x + size / 2, canvas.width - 1)) * 4;
            const rColor = imgData.data[pixelIndex];
            const gColor = imgData.data[pixelIndex + 1];
            const bColor = imgData.data[pixelIndex + 2];
            const aColor = imgData.data[pixelIndex + 3];

            ctx.fillStyle = `rgba(${rColor},${gColor},${bColor},${aColor / 255})`;
            ctx.fillRect(x, y, size, size);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSource]);

  return (
    <canvas
      ref={canvasRef}
      width={288}
      height={288}
      className="w-full h-full object-cover"
    ></canvas>
  );
}
