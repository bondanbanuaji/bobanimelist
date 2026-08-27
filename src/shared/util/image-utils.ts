import type { TenraiImages } from '../../services/tenrai/models';

/**
 * Gets the highest quality image URL from Tenrai images object
 * Priority order: webp maximum > jpg maximum > webp large > jpg large > webp image_url > jpg image_url > fallback
 */
export function getBestImageUrl(images: TenraiImages, preferWebP = true): string {
  // If preferWebP is true, try webp formats first
  if (preferWebP) {
    // Try webp maximum first
    if (images.webp?.maximum_image_url) return images.webp.maximum_image_url;
    // Then webp large
    if (images.webp?.large_image_url) return images.webp.large_image_url;
    // Then webp default
    if (images.webp?.image_url) return images.webp.image_url;
  }

  // Try jpg maximum
  if (images.jpg.maximum_image_url) return images.jpg.maximum_image_url;
  // Then jpg large
  if (images.jpg.large_image_url) return images.jpg.large_image_url;
  // Then jpg default
  if (images.jpg.image_url) return images.jpg.image_url;

  // Fallback to original image_url if available
  return images.jpg.image_url;
}

/**
 * Gets the large quality image URL from Tenrai images object
 * Priority order: webp large > jpg large > webp image_url > jpg image_url > fallback
 */
export function getLargeImageUrl(images: TenraiImages, preferWebP = true): string {
  // If preferWebP is true, try webp formats first
  if (preferWebP) {
    // Try webp large first
    if (images.webp?.large_image_url) return images.webp.large_image_url;
    // Then webp default
    if (images.webp?.image_url) return images.webp.image_url;
  }

  // Try jpg large
  if (images.jpg.large_image_url) return images.jpg.large_image_url;
  // Then jpg default
  if (images.jpg.image_url) return images.jpg.image_url;

  // Fallback to original image_url if available
  return images.jpg.image_url;
}

/**
 * Gets the medium quality image URL from Tenrai images object
 * Priority order: webp medium > jpg medium > webp image_url > jpg image_url > fallback
 */
export function getMediumImageUrl(images: TenraiImages, preferWebP = true): string {
  // If preferWebP is true, try webp formats first
  if (preferWebP) {
    // Try webp medium first
    if (images.webp?.medium_image_url) return images.webp.medium_image_url;
    // Then webp default
    if (images.webp?.image_url) return images.webp.image_url;
  }

  // Try jpg medium
  if (images.jpg.medium_image_url) return images.jpg.medium_image_url;
  // Then jpg default
  if (images.jpg.image_url) return images.jpg.image_url;

  // Fallback to original image_url if available
  return images.jpg.image_url;
}

/**
 * Gets the small quality image URL from Tenrai images object
 * Priority order: webp small > jpg small > webp image_url > jpg image_url > fallback
 */
export function getSmallImageUrl(images: TenraiImages, preferWebP = true): string {
  // If preferWebP is true, try webp formats first
  if (preferWebP) {
    // Try webp small first
    if (images.webp?.small_image_url) return images.webp.small_image_url;
    // Then webp default
    if (images.webp?.image_url) return images.webp.image_url;
  }

  // Try jpg small
  if (images.jpg.small_image_url) return images.jpg.small_image_url;
  // Then jpg default
  if (images.jpg.image_url) return images.jpg.image_url;

  // Fallback to original image_url if available
  return images.jpg.image_url;
}

/**
 * Fisher-Yates Shuffle Algorithm
 * Shuffles an array in place
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array]; // Create a copy to avoid mutating the original
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};