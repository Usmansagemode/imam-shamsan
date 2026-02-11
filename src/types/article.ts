export interface ArticleSummary {
  id: string
  slug: string
  title: string
  description: string
  coverImage: string
  language: 'English' | 'Arabic' | 'Bilingual'
  category: string
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Article extends ArticleSummary {
  content: ContentBlock[]
}

export interface ContentBlock {
  id: string
  type: string
  content: string
  language?: string
  richText?: RichTextItem[]
  children?: ContentBlock[]
  // For images
  imageUrl?: string
  caption?: string
  // For lists
  items?: ContentBlock[]
  // For code blocks
  codeLanguage?: string
  // For callouts
  icon?: string
  // For headings
  level?: number
}

export interface RichTextItem {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  color?: string
  href?: string
}
