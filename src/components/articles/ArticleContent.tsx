import { cn } from '@/lib/utils'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import type { ContentBlock, RichTextItem } from '@/types/article'

function renderRichText(items: RichTextItem[]): React.ReactNode[] {
  return items.map((item, i) => {
    let node: React.ReactNode = item.text

    if (item.href) {
      node = (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2"
        >
          {node}
        </a>
      )
    }

    if (item.bold) node = <strong>{node}</strong>
    if (item.italic) node = <em>{node}</em>
    if (item.underline) node = <u>{node}</u>
    if (item.strikethrough) node = <s>{node}</s>
    if (item.code) {
      node = (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
          {node}
        </code>
      )
    }

    return <span key={i}>{node}</span>
  })
}

function renderBlock(block: ContentBlock): React.ReactNode {
  const richContent =
    block.richText && block.richText.length > 0
      ? renderRichText(block.richText)
      : block.content

  switch (block.type) {
    case 'paragraph':
      if (!block.content && (!block.richText || block.richText.length === 0)) {
        return <div key={block.id} className="h-4" />
      }
      return (
        <p key={block.id} className="leading-relaxed">
          {richContent}
        </p>
      )

    case 'heading_1':
      return (
        <h1
          key={block.id}
          className="text-3xl font-bold tracking-tight mt-8 mb-4"
        >
          {richContent}
        </h1>
      )

    case 'heading_2':
      return (
        <h2
          key={block.id}
          className="text-2xl font-bold tracking-tight mt-6 mb-3"
        >
          {richContent}
        </h2>
      )

    case 'heading_3':
      return (
        <h3
          key={block.id}
          className="text-xl font-semibold mt-4 mb-2"
        >
          {richContent}
        </h3>
      )

    case 'bulleted_list_item':
      return (
        <li key={block.id} className="ml-6 list-disc">
          {richContent}
        </li>
      )

    case 'numbered_list_item':
      return (
        <li key={block.id} className="ml-6 list-decimal">
          {richContent}
        </li>
      )

    case 'quote':
      return (
        <blockquote
          key={block.id}
          className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4"
        >
          {richContent}
        </blockquote>
      )

    case 'callout':
      return (
        <div
          key={block.id}
          className="my-4 flex gap-3 rounded-lg bg-accent/50 p-4"
        >
          {block.icon && <span className="text-xl">{block.icon}</span>}
          <div className="flex-1">{richContent}</div>
        </div>
      )

    case 'code':
      return (
        <pre
          key={block.id}
          className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono"
        >
          <code>{block.content}</code>
        </pre>
      )

    case 'image':
      return (
        <figure key={block.id} className="my-6">
          <CloudinaryImage
            src={block.imageUrl || ''}
            alt={block.caption || ''}
            preset="hero"
            className="rounded-lg"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'divider':
      return <hr key={block.id} className="my-8 border-border" />

    case 'embed':
    case 'video': {
      const embedUrl = block.content
      if (!embedUrl) return null
      return (
        <div key={block.id} className="my-6 aspect-video overflow-hidden rounded-lg">
          <iframe
            src={embedUrl}
            title="Embedded content"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    case 'bookmark':
      return block.content ? (
        <a
          key={block.id}
          href={block.content}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block rounded-lg border border-border p-4 text-primary hover:bg-muted transition-colors"
        >
          {block.content}
        </a>
      ) : null

    default:
      if (block.content) {
        return (
          <p key={block.id} className="leading-relaxed">
            {richContent}
          </p>
        )
      }
      return null
  }
}

interface ArticleContentProps {
  blocks: ContentBlock[]
  isArabic?: boolean
}

export function ArticleContent({ blocks, isArabic }: ArticleContentProps) {
  return (
    <div
      className={cn(
        'prose-custom space-y-4 text-foreground',
        isArabic && 'font-arabic',
      )}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {blocks.map(renderBlock)}
    </div>
  )
}
