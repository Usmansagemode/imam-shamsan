import { Link } from '@tanstack/react-router'
import { ArrowRight, Youtube } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/types/settings'

interface MediaHighlightProps {
  settings: SiteSettings
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  // Handle youtube.com/watch?v=xxx
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  // Handle youtu.be/xxx
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  // Handle youtube.com/live/xxx
  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/)
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`

  return null
}

export function MediaHighlight({ settings }: MediaHighlightProps) {
  const liveStreamUrl = settings.live_stream_url
  const liveStreamTitle = settings.live_stream_title || 'Weekly Live Stream'
  const embedUrl = liveStreamUrl ? getYouTubeEmbedUrl(liveStreamUrl) : null

  return (
    <section className="border-t border-border py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Media
            </h2>
            <p className="mt-2 text-muted-foreground">
              Watch sermons, recitations & live streams
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
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {liveStreamTitle}
            </h3>
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
