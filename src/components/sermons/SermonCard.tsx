import { Link } from '@tanstack/react-router'
import { Calendar, Youtube } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { SermonSummary } from '@/types/sermon'

interface SermonCardProps {
  sermon: SermonSummary
}

export function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Link
      to="/sermons/$slug"
      params={{ slug: sermon.slug }}
      className="group flex flex-col rounded-xl ring-1 ring-foreground/10 bg-card p-5 transition-all hover:ring-primary/30 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {sermon.title}
      </h3>

      {sermon.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {sermon.description}
        </p>
      )}

      <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
        {sermon.date && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(sermon.date)}
          </span>
        )}
        {sermon.youtubeLink && (
          <span className="flex items-center gap-1 text-red-500">
            <Youtube className="size-3" />
            Video
          </span>
        )}
      </div>
    </Link>
  )
}
