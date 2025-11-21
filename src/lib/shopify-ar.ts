import { storefrontApiRequest } from "./shopify";

const GET_PRODUCT_WITH_MEDIA = `
  query GetProductMedia($handle: String!) {
    product(handle: $handle) {
      id
      title
      media(first: 20) {
        edges {
          node {
            mediaContentType
            alt
            ... on Model3d {
              id
              sources {
                url
                mimeType
                format
              }
              originalSource {
                url
                mimeType
                format
              }
            }
            ... on ExternalVideo {
              id
              embeddedUrl
            }
            ... on Video {
              id
              sources {
                url
                mimeType
                format
              }
            }
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export interface Model3dSource {
  url: string;
  mimeType: string;
  format: string;
}

export interface Product3dMedia {
  id: string;
  mediaContentType: string;
  sources: Model3dSource[];
  originalSource: Model3dSource;
}

export async function getProductARMedia(productHandle: string): Promise<Product3dMedia[]> {
  try {
    const data = await storefrontApiRequest(GET_PRODUCT_WITH_MEDIA, {
      handle: productHandle,
    });

    const media = data?.data?.product?.media?.edges || [];
    
    // Filter for 3D models only
    const models = media
      .filter((edge: any) => edge.node.mediaContentType === 'MODEL_3D')
      .map((edge: any) => edge.node);

    return models;
  } catch (error) {
    console.error('Error fetching AR media:', error);
    return [];
  }
}

export function isARSupported(): boolean {
  // Check if browser supports AR
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  // iOS supports AR Quick Look, Android supports Scene Viewer
  return isIOS || isAndroid;
}

export function getARViewerUrl(model: Product3dMedia): string | null {
  // Find USDZ format for iOS AR Quick Look
  const usdzSource = model.sources.find(s => s.format === 'usdz');
  
  // Find GLB format for Android Scene Viewer
  const glbSource = model.sources.find(s => s.format === 'glb');
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS && usdzSource) {
    return usdzSource.url;
  }
  
  if (!isIOS && glbSource) {
    // Android Scene Viewer URL format
    return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbSource.url)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
  }
  
  return null;
}
