// src/utils/imageOptimizer.ts

/**
 * Compresses an image, converts it to WebP format, and resizes it if it exceeds max dimensions.
 */
export const optimizeImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio resizing
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context generation failed'));
        
        ctx.drawImage(img, 0, 0, width, height);

        // Export directly to modern WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP compression failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image into element'));
    };
    reader.onerror = () => reject(new Error('File reading failed'));
  });
};
