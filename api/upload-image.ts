// api/upload-image.ts

import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ==========================================================================
   1. RUNTIME SERVERLESS MIDDLEWARE PARSER CONFIGURATION
   ========================================================================== */
export const config = {
  api: {
    // 🚀 CRITICAL OVERRIDE: Disabling internal body parsers completely.
    // This stops Vercel from trying to parse the binary image stream into text,
    // letting us read the incoming stream directly as raw hardware binary data chunks.
    bodyParser: false,
  },
};

/* ==========================================================================
   2. CORE MEDIA INGESTION SERVERLESS ROUTE HANDLER
   ========================================================================== */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enforce rigid request method safety validations
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `HTTP Method ${req.method} not allowed.` });
  }

  try {
    // Extract our custom target header metadata values dropped from our useImageUpload hook
    const filename = (req.headers['x-filename'] as string) || `upload-${Date.now()}.webp`;
    const contentType = req.headers['content-type'] || 'image/webp';

    /* ==========================================================================
       3. DIRECT DISTRIBUTED STORAGE STREAM MUTATION
       ========================================================================== */
    // Pump the incoming raw binary stream directly into Vercel's storage backend.
    // The put() function automatically consumes the VercelRequest object as a raw stream.
    const blobResult = await put(filename, req, {
      access: 'public', // Ensures public URL paths are generated for your image tags
      contentType: contentType, // Forces standard browser content delivery types
      addRandomSuffix: true, // Prevents collisions by appending a hash identifier
      // Injected automatically on Vercel production platforms. 
      // Locally, it reads from your pulled .env file configurations.
      token: process.env.BLOB_READ_WRITE_TOKEN, 
    });

    // Respond with a clean 200 payload dropping our production CDN edge route string link
    return res.status(200).json(blobResult);

  } catch (error: any) {
    console.error("Vercel Blob serverless ingestion subsystem exception:", error);
    return res.status(500).json({ 
      error: "Internal Media Storage Exception Context", 
      message: error?.message || "Unknown proxy pipeline fault." 
    });
  }
}
