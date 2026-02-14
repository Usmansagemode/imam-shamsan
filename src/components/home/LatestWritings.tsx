import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ArticleCard } from '@/components/articles/ArticleCard'
import type { ArticleSummary } from '@/types/article'

interface LatestWritingsProps {
  articles: ArticleSummary[]
}

export function LatestWritings({ articles }: LatestWritingsProps) {
  if (!articles.length) return null

  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Latest Writings
            </h2>
            <p className="mt-2 text-muted-foreground">
              Recent writings and reflections
            </p>
          </div>
          <Link
            to="/writings"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/writings">
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              View All Writings
              <ArrowRight className="size-4" />
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
