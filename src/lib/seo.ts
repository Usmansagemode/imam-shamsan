import type { ArticleSummary, Article } from '@/types/article'

export const siteConfig = {
  name: 'Imam Dr. Shamsan Al-Jabi',
  description:
    'Official website of Imam Dr. Shamsan Al-Jabi - Islamic scholar, educator, and community leader. Explore articles, sermons, services, and more.',
  url: process.env.SITE_URL || 'https://imamshamsan.com',
  author: 'Imam Dr. Shamsan Al-Jabi',
  locale: 'en_US',
  youtubeChannel: 'UCHsyLCyXVM8L25qwS7h9Gjg',
}

const defaultOgImage = `${siteConfig.url}/og-image.jpg`

interface MetaTag {
  name?: string
  property?: string
  content?: string
  charSet?: string
  title?: string
}

interface LinkTag {
  rel: string
  href: string
  type?: string
}

interface ScriptTag {
  type: string
  children: string
}

export interface HeadConfig {
  meta: Array<MetaTag>
  links: Array<LinkTag>
  scripts?: Array<ScriptTag>
}

export function getBaseMeta(): Array<MetaTag> {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: siteConfig.author },
  ]
}

export function getPageMeta(options: {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}): HeadConfig {
  const {
    title,
    description,
    canonicalUrl,
    ogImage = defaultOgImage,
    ogType = 'website',
    noIndex = false,
  } = options

  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.name}`
  const url = canonicalUrl || siteConfig.url

  const meta: Array<MetaTag> = [
    { title: fullTitle },
    { name: 'description', content: description },
    ...(noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),

    // Open Graph
    { property: 'og:type', content: ogType },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { property: 'og:locale', content: siteConfig.locale },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]

  const links: Array<LinkTag> = [{ rel: 'canonical', href: url }]

  return { meta, links }
}

export function getHomeMeta(): HeadConfig {
  return getPageMeta({
    title: siteConfig.name,
    description: siteConfig.description,
    canonicalUrl: siteConfig.url,
    ogType: 'website',
  })
}

export function getAboutMeta(): HeadConfig {
  return getPageMeta({
    title: 'About',
    description:
      'Learn about Imam Dr. Shamsan Al-Jabi - his education, ijazaat, specializations, and journey as an Islamic scholar and community leader.',
    canonicalUrl: `${siteConfig.url}/about`,
  })
}

export function getServicesMeta(): HeadConfig {
  return getPageMeta({
    title: 'Services',
    description:
      'Book services with Imam Dr. Shamsan Al-Jabi - Nikah ceremonies, funeral services, Quran tutoring, counseling, and more.',
    canonicalUrl: `${siteConfig.url}/services`,
  })
}

export function getWritingsListMeta(): HeadConfig {
  return getPageMeta({
    title: 'Writings',
    description:
      'Articles and reflections by Imam Dr. Shamsan Al-Jabi on Islamic knowledge, Quran commentary, and spiritual guidance.',
    canonicalUrl: `${siteConfig.url}/writings`,
  })
}

export function getSermonsListMeta(): HeadConfig {
  return getPageMeta({
    title: 'Sermon Summaries',
    description:
      'Written summaries of Friday khutbahs and sermons by Imam Dr. Shamsan Al-Jabi.',
    canonicalUrl: `${siteConfig.url}/sermons`,
  })
}

export function getMediaMeta(): HeadConfig {
  return getPageMeta({
    title: 'Media',
    description:
      'Watch sermons, recitations, and live streams from Imam Dr. Shamsan Al-Jabi.',
    canonicalUrl: `${siteConfig.url}/media`,
  })
}

export function getGalleryMeta(): HeadConfig {
  return getPageMeta({
    title: 'Gallery',
    description:
      'Photos from events, conferences, community programs, and more with Imam Dr. Shamsan Al-Jabi.',
    canonicalUrl: `${siteConfig.url}/gallery`,
  })
}

export function getContactMeta(): HeadConfig {
  return getPageMeta({
    title: 'Contact',
    description:
      'Get in touch with Imam Dr. Shamsan Al-Jabi for bookings, inquiries, or community services.',
    canonicalUrl: `${siteConfig.url}/contact`,
  })
}

export function getArticleMeta(article: Article | ArticleSummary): HeadConfig {
  const description =
    article.description ||
    `Read "${article.title}" by Imam Dr. Shamsan Al-Jabi.`
  const ogImage = article.coverImage || defaultOgImage
  const canonicalUrl = `${siteConfig.url}/writings/${article.slug}`

  return getPageMeta({
    title: article.title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'article',
  })
}

export function getPersonSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Imam Dr. Shamsan Al-Jabi',
    alternateName: 'الدكتور. شمسان الجابي',
    url: siteConfig.url,
    jobTitle: 'Imam & Islamic Scholar',
    description: siteConfig.description,
    sameAs: [
      `https://www.youtube.com/channel/${siteConfig.youtubeChannel}`,
    ],
  }
  return JSON.stringify(schema)
}

export function getArticleSchema(article: Article): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.coverImage || undefined,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    url: `${siteConfig.url}/writings/${article.slug}`,
    inLanguage: article.language === 'Arabic' ? 'ar' : 'en',
  }
  const cleanSchema = JSON.parse(JSON.stringify(schema))
  return JSON.stringify(cleanSchema)
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return JSON.stringify(schema)
}
