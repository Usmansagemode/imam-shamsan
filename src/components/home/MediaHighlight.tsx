import { Link } from '@tanstack/react-router'
import { ArrowRight, Youtube } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { getYouTubeEmbedUrl, getStreamStatus } from '@/lib/youtube'
import type { SiteSettings } from '@/types/settings'

interface MediaHighlightProps {
  settings: SiteSettings
}

export function MediaHighlight({ settings }: MediaHighlightProps) {
  const liveStreamUrl = settings.live_stream_url?.value
  const liveStreamTitle = settings.live_stream_title?.value || 'Weekly Live Stream'
  const youtubeChannelUrl = settings.youtube_url?.value || 'https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg'
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
                  href={youtubeChannelUrl}
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
