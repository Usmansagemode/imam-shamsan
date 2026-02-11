import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/shared/ArabicText'
import { formatDate } from '@/lib/utils'
import { getArticleBySlug } from '@/lib/notion'
import { getArticleMeta, getArticleSchema, getBreadcrumbSchema, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/writings/$slug')({
  loader: async ({ params }) => {
    const article = await getArticleBySlug({ data: params.slug })
    if (!article) {
      throw new Error('Article not found')
    }
    return { article }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) return { meta: [] }
    const { meta, links } = getArticleMeta(loaderData.article)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getArticleSchema(loaderData.article),
        },
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Writings', url: `${siteConfig.url}/writings` },
            {
              name: loaderData.article.title,
              url: `${siteConfig.url}/writings/${loaderData.article.slug}`,
            },
          ]),
        },
      ],
    }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { article } = Route.useLoaderData()
  const isArabic = article.language === 'Arabic'

  return (
    <article>
      {/* Cover Image */}
      {article.coverImage && (
        <div className="aspect-[21/9] w-full overflow-hidden">
          <CloudinaryImage
            src={article.coverImage}
            alt={article.title}
            preset="hero"
            className="h-full w-full"
          />
        </div>
      )}

      <Container size="narrow">
        <div className="py-8">
          {/* Back link */}
          <Link
            to="/writings"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Writings
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.category && (
              <Badge variant="muted">{article.category}</Badge>
            )}
            {article.language !== 'English' && (
              <Badge variant="secondary">{article.language}</Badge>
            )}
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="size-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          {isArabic ? (
            <ArabicText
              as="h1"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {article.title}
            </ArabicText>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {article.title}
            </h1>
          )}

          {/* Date */}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <time>{formatDate(article.createdAt)}</time>
          </div>

          {/* Description */}
          {article.description && (
            <p
              className="mt-4 text-lg text-muted-foreground"
              dir={isArabic ? 'rtl' : undefined}
            >
              {article.description}
            </p>
          )}

          {/* Divider */}
          <hr className="my-8 border-border" />

          {/* Content */}
          <ArticleContent
            blocks={article.content}
            isArabic={isArabic}
          />
        </div>
      </Container>
    </article>
  )
}
