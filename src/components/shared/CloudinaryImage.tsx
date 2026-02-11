import { cn } from '@/lib/utils'
import { getOptimizedUrl } from '@/lib/cloudinary'

type ImagePreset = 'thumbnail' | 'hero' | 'card' | 'article-cover' | 'gallery-thumb' | 'gallery-full' | 'avatar'

interface CloudinaryImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  alt: string
  preset?: ImagePreset
}

export function CloudinaryImage({
  src,
  alt,
  preset = 'card',
  className,
  ...props
}: CloudinaryImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className,
        )}
      >
        <span className="text-sm">No image</span>
      </div>
    )
  }

  const optimizedUrl = getOptimizedUrl(src, preset)

  return (
    <img
      src={optimizedUrl}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      loading="lazy"
      {...props}
    />
  )
}
