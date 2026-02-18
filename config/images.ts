/**
 * Image Configuration
 * 
 * Centralized configuration for images and placeholders
 */

// Placeholder service configuration
export const PLACEHOLDER_CONFIG = {
  // Primary placeholder service
  primary: {
    baseUrl: 'https://placehold.co',
    bgColor: 'dcfce7', // Light green from palette
    textColor: '16a34a', // Primary green from palette
  },
  
  // Alternative services
  alternatives: {
    picsum: 'https://picsum.photos',
    placeholder: 'https://via.placeholder.com',
  }
}

// Generate placeholder URL
export function generatePlaceholder(
  text: string, 
  width = 400, 
  height = 400,
  bgColor = PLACEHOLDER_CONFIG.primary.bgColor,
  textColor = PLACEHOLDER_CONFIG.primary.textColor
): string {
  return `${PLACEHOLDER_CONFIG.primary.baseUrl}/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`
}

// Product placeholder images by category
export const PRODUCT_PLACEHOLDERS: Record<string, string> = {
  'Овощи': generatePlaceholder('Овощи', 400, 400),
  'Зелень': generatePlaceholder('Зелень', 400, 400),
  'Бобовые': generatePlaceholder('Бобовые', 400, 400),
  'Семена': generatePlaceholder('Семена', 400, 400),
  'default': generatePlaceholder('MicroGreen', 400, 400),
}

// Get placeholder by category
export function getPlaceholderByCategory(category?: string): string {
  if (!category) return PRODUCT_PLACEHOLDERS.default
  return PRODUCT_PLACEHOLDERS[category] || PRODUCT_PLACEHOLDERS.default
}

// Hero section placeholder
export const HERO_PLACEHOLDER = generatePlaceholder('MicroGreen+Shop', 800, 600)

// Validate image URL
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false
  if (url.trim() === '') return false
  
  // Check if it's a valid URL
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Get image URL with fallback
export function getImageUrl(
  url: string | null | undefined, 
  fallbackCategory?: string
): string {
  if (isValidImageUrl(url)) return url!
  return getPlaceholderByCategory(fallbackCategory)
}
