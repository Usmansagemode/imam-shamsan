import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SermonContent } from '@/components/sermons/SermonContent'
import { formatDate } from '@/lib/utils'
import { getSermonBySlug } from '@/lib/notion'
import { getPageMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/sermons/$slug')({
  loader: async ({ params }) => {
    const sermon = await getSermonBySlug({ data: params.slug })
    if (!sermon) {
      throw new Error('Sermon not found')
    }
    return { sermon }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.sermon) return { meta: [] }
    const sermon = loaderData.sermon
    const { meta, links } = getPageMeta({
      title: sermon.title,
      description: sermon.description || `Sermon summary: ${sermon.title}`,
      canonicalUrl: `${siteConfig.url}/sermons/${sermon.slug}`,
      ogType: 'article',
    })
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Sermons', url: `${siteConfig.url}/sermons` },
            { name: sermon.title, url: `${siteConfig.url}/sermons/${sermon.slug}` },
          ]),
        },
      ],
    }
  },
  component: SermonPage,
  errorComponent: ({ error }) => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Sermon Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          {error instanceof Error && error.message === 'Sermon not found'
            ? "This sermon doesn't exist or has been removed."
            : 'Something went wrong loading this sermon.'}
        </p>
        <Link
          to="/sermons"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Sermons
        </Link>
      </div>
    </Container>
  ),
})

function SermonPage() {
  const { sermon } = Route.useLoaderData()

  return (
    <Container size="narrow">
      <div className="py-8">
        <Link
          to="/sermons"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Sermons
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {sermon.title}
        </h1>

        {sermon.date && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <time>{formatDate(sermon.date)}</time>
          </div>
        )}

        {sermon.description && (
          <p className="mt-4 text-lg text-muted-foreground">
            {sermon.description}
          </p>
        )}

        <hr className="my-8 border-border" />

        <SermonContent
          blocks={sermon.content}
          youtubeLink={sermon.youtubeLink}
        />
      </div>
    </Container>
  )
}
