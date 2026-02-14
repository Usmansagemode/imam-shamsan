import { ArticleContent } from '@/components/articles/ArticleContent'
import type { ContentBlock } from '@/types/article'

interface SermonContentProps {
  blocks: ContentBlock[]
  youtubeLink?: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null

  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/)
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`

  return null
}

export function SermonContent({ blocks, youtubeLink }: SermonContentProps) {
  const embedUrl = youtubeLink ? getYouTubeEmbedUrl(youtubeLink) : null

  return (
    <div>
      {embedUrl && (
        <div className="mb-8 aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <iframe
            src={embedUrl}
            title="Sermon video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <ArticleContent blocks={blocks} />
    </div>
  )
}
