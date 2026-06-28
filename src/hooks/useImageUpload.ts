// src/hooks/useImageUpload.ts
import { useState } from 'react';
import { optimizeImage } from '../utils/imageOptimizer';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<string | null> => {
    // 1. Quick MIME validation check
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return null;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // 2. Client-side optimize to WebP
      const optimizedBlob = await optimizeImage(file, maxWidth, quality);
      
      // 3. Clean the filename for the CDN URL
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
      const filename = `${Date.now()}-${cleanName}.webp`;

      // 4. Stream to our Serverless API
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': 'image/webp',
        },
        body: optimizedBlob,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const blobResult = await response.json();
      return blobResult.url; // This returns the clean Vercel Blob URL string
    } catch (error: any) {
      console.error("Upload handler error:", error);
      setUploadError(error.message || 'Failed to upload image.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, uploadError };
};
