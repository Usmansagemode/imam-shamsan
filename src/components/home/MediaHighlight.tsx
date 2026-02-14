import { Link } from '@tanstack/react-router'
import { ArrowRight, Youtube } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/types/settings'

interface MediaHighlightProps {
  settings: SiteSettings
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

function getStreamStatus(dateStr: string | undefined): { isLive: boolean; timeAgo: string | null } {
  if (!dateStr) return { isLive: false, timeAgo: null }

  const streamDate = new Date(dateStr)
  if (isNaN(streamDate.getTime())) return { isLive: false, timeAgo: null }

  const now = new Date()
  const diffMs = now.getTime() - streamDate.getTime()
  if (diffMs < 0) return { isLive: false, timeAgo: null }

  const fourHours = 4 * 60 * 60 * 1000
  if (diffMs < fourHours) {
    return { isLive: true, timeAgo: null }
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)

  let timeAgo: string
  if (diffHours < 24) {
    timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else if (diffWeeks < 5) {
    timeAgo = `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
  } else {
    timeAgo = streamDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return { isLive: false, timeAgo }
}

export function MediaHighlight({ settings }: MediaHighlightProps) {
  const liveStreamUrl = settings.live_stream_url?.value
  const liveStreamTitle = settings.live_stream_title?.value || 'Weekly Live Stream'
  const embedUrl = liveStreamUrl ? getYouTubeEmbedUrl(liveStreamUrl) : null
  const { isLive, timeAgo } = getStreamStatus(settings.live_stream_url?.updatedAt)

  return (
    <section className="border-t border-border py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {embedUrl ? 'Live Stream' : 'Media'}
              </h2>
              {embedUrl && isLive && (
                <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                  </span>
                  LIVE
                </span>
              )}
              {embedUrl && !isLive && timeAgo && (
                <span className="text-sm text-muted-foreground">
                  {timeAgo}
                </span>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">
              {embedUrl && isLive
                ? 'Watch the current live broadcast'
                : embedUrl
                  ? liveStreamTitle
                  : 'Watch sermons, recitations & live streams'}
            </p>
          </div>
          <Link
            to="/media"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {embedUrl ? (
          <div className="mx-auto max-w-3xl">
            <div className="aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <iframe
                src={embedUrl}
                title={liveStreamTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-xl bg-muted/50 p-12">
              <Youtube className="mx-auto size-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Visit Our YouTube Channel
              </h3>
              <p className="mt-2 text-muted-foreground">
                Watch sermons, recitations, and educational content
              </p>
              <div className="mt-4">
                <a
                  href="https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    <Youtube className="size-4" />
                    YouTube Channel
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
