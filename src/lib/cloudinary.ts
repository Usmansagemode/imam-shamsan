type ImagePreset = 'thumbnail' | 'hero' | 'card' | 'article-cover' | 'gallery-thumb' | 'gallery-full' | 'avatar'

interface PresetConfig {
  width: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale'
}

const presets: Record<ImagePreset, PresetConfig> = {
  thumbnail: { width: 400, height: 300, crop: 'fill' },
  card: { width: 600, height: 400, crop: 'fill' },
  hero: { width: 1200, height: 800, crop: 'fill' },
  'article-cover': { width: 1200, height: 630, crop: 'fill' },
  'gallery-thumb': { width: 400, height: 400, crop: 'fill' },
  'gallery-full': { width: 1400 },
  avatar: { width: 200, height: 200, crop: 'fill' },
}

/**
 * Transform a Cloudinary URL with optimization parameters
 */
export function getOptimizedUrl(url: string, preset: ImagePreset): string {
  if (!url) return ''

  const cloudinaryRegex =
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/
  const match = url.match(cloudinaryRegex)

  if (!match) {
    return url
  }

  const [, cloudName, pathWithTransforms] = match

  const pathParts = pathWithTransforms.split('/')
  const transformRegex = /^(w_|h_|c_|q_|f_|ar_|g_|dpr_|e_|l_|fl_|t_)/
  const firstNonTransformIndex = pathParts.findIndex(
    (part) => !transformRegex.test(part) && !part.includes(','),
  )

  let imagePath: string
  if (firstNonTransformIndex === -1) {
    imagePath = pathParts.join('/')
  } else {
    imagePath = pathParts.slice(firstNonTransformIndex).join('/')
  }

  const config = presets[preset]
  const transforms: string[] = []

  transforms.push(`w_${config.width}`)
  if (config.height) transforms.push(`h_${config.height}`)
  if (config.crop) transforms.push(`c_${config.crop}`)
  transforms.push('q_auto', 'f_auto')

  const transformation = transforms.join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${imagePath}`
}

/**
 * Get a blur placeholder URL for loading states
 */
export function getBlurPlaceholder(url: string): string {
  if (!url) return ''

  const cloudinaryRegex =
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/
  const match = url.match(cloudinaryRegex)

  if (!match) return url

  const [, cloudName, pathWithTransforms] = match
  const pathParts = pathWithTransforms.split('/')
  const transformRegex = /^(w_|h_|c_|q_|f_|ar_|g_|dpr_|e_|l_|fl_|t_)/
  const firstNonTransformIndex = pathParts.findIndex(
    (part) => !transformRegex.test(part) && !part.includes(','),
  )

  const imagePath =
    firstNonTransformIndex === -1
      ? pathParts.join('/')
      : pathParts.slice(firstNonTransformIndex).join('/')

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_50,h_50,c_fill,q_auto,f_auto,e_blur:1000/${imagePath}`
}
