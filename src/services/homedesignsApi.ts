/**
 * HomeDesigns AI API Service
 *
 * This service handles communication with the HomeDesigns AI API
 * for material/color swapping on furniture images.
 *
 * API Documentation: https://api.homedesigns.ai/homedesignsai-api-documentation/core-apis/material-swap
 *
 * Note: In production, API calls should go through a backend proxy
 * to protect the API key. Set VITE_HOMEDESIGNS_PROXY_URL to your backend endpoint.
 */

export interface RecolorRequest {
  image: File;
  color: string;
  designType?: 'Interior' | 'Exterior';
  materials?: string;
}

export interface RecolorResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// Use proxy URL in production, direct API in development with exposed key
const API_ENDPOINT = import.meta.env.VITE_HOMEDESIGNS_PROXY_URL || '/api/recolor-recliner';

/**
 * Recolor a recliner image using HomeDesigns AI
 *
 * In production, this calls your backend proxy which then calls HomeDesigns AI.
 * The backend should:
 * 1. Accept the image and color
 * 2. Call POST https://homedesigns.ai/api/v2/change_color_textures
 * 3. Return the result image URL
 */
export async function recolorRecliner(request: RecolorRequest): Promise<RecolorResponse> {
  try {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('color', request.color);
    formData.append('design_type', request.designType || 'Interior');
    formData.append('materials', request.materials || 'Fabrics');
    formData.append('no_design', '1'); // Keep same design, only change color/material

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HomeDesigns API error:', errorText);
      return {
        success: false,
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      imageUrl: data.imageUrl || data.result_image_url || data.url,
    };

  } catch (error) {
    console.error('Recolor request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Development/Demo mode: Simulate recoloring with color overlay
 * This is used when no API key is configured
 */
export async function simulateRecolor(
  imageDataUrl: string,
  colorHex: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Apply color overlay with multiply blend
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Restore some of the original detail
      ctx.globalCompositeOperation = 'overlay';
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
}

/**
 * Check if the HomeDesigns API is configured
 */
export function isApiConfigured(): boolean {
  return !!import.meta.env.VITE_HOMEDESIGNS_PROXY_URL;
}
