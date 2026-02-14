import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/notion'
import { getBaseMeta, siteConfig } from '@/lib/seo'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: async () => {
    const settings = await getSiteSettings()
    return { settings }
  },
  head: () => ({
    meta: [
      ...getBaseMeta(),
      {
        title: siteConfig.name,
      },
      {
        name: 'description',
        content: siteConfig.description,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            const theme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  const { settings } = Route.useLoaderData()
  const logoUrl = settings.logo?.value

  return (
    <RootDocument logoUrl={logoUrl}>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
