import { createFileRoute } from '@tanstack/react-router'
import { Youtube, Radio, BookOpen } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { getSiteSettings } from '@/lib/notion'
import { getMediaMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/media')({
  loader: async () => {
    const settings = await getSiteSettings()
    return { settings }
  },
  head: () => {
    const { meta, links } = getMediaMeta()
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Media', url: `${siteConfig.url}/media` },
          ]),
        },
      ],
    }
  },
  component: MediaPage,
})

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/)
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`
  return null
}

function MediaPage() {
  const { settings } = Route.useLoaderData()

  const liveStreamUrl = settings.live_stream_url
  const liveStreamTitle = settings.live_stream_title || 'Weekly Live Stream'
  const embedUrl = liveStreamUrl ? getYouTubeEmbedUrl(liveStreamUrl) : null

  return (
    <>
      <section className="bg-gradient-to-b from-accent/30 to-background py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Media</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Sermons, recitations, live streams, and more
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="space-y-16">
            {/* Live Stream Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Radio className="size-6 text-red-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  Live Stream
                </h2>
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
                <div className="rounded-xl bg-muted/50 p-8 text-center">
                  <p className="text-muted-foreground">
                    No live stream scheduled at this time. Check back for the
                    next weekly broadcast.
                  </p>
                </div>
              )}
            </div>

            {/* Recitations Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <BookOpen className="size-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Qur'anic Recitations
                </h2>
              </div>
              <div className="rounded-xl bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">
                  Recitations will be available soon. Stay tuned!
                </p>
              </div>
            </div>

            {/* YouTube Channel */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Youtube className="size-6 text-red-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  YouTube Channel
                </h2>
              </div>
              <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-8 text-center">
                <Youtube className="mx-auto size-16 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">
                  Watch all sermons and lectures
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Subscribe to our YouTube channel for the latest khutbahs,
                  lectures, and educational content.
                </p>
                <div className="mt-6">
                  <a
                    href="https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2">
                      <Youtube className="size-4" />
                      Visit YouTube Channel
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
