/**
 * Generates `public/robots.txt`, `public/sitemap.xml`, and `public/feed.xml`
 * before `next build`. Replaces the SSR equivalents that lived under
 * `pages/robots.txt.tsx`, `pages/sitemap.xml.tsx`, and `pages/feed.tsx`.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

import { type ExtendedRecordMap } from 'notion-types'
import {
  getBlockParentPage,
  getBlockTitle,
  getPageProperty,
  idToUuid
} from 'notion-utils'
import RSS from 'rss'

import * as config from '../lib/config'
import { getSiteMap } from '../lib/get-site-map'
import { getCanonicalPageUrl } from '../lib/map-page-url'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

async function main() {
  const siteMap = await getSiteMap()
  await mkdir(PUBLIC_DIR, { recursive: true })

  const isProduction = process.env.BUILD_ENV === 'production'

  await Promise.all([
    writeFile(path.join(PUBLIC_DIR, 'robots.txt'), buildRobots(isProduction)),
    writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(siteMap)),
    writeFile(path.join(PUBLIC_DIR, 'feed.xml'), buildFeed(siteMap))
  ])

  console.log(
    `wrote robots.txt, sitemap.xml, feed.xml to public/ (production=${isProduction})`
  )
}

function buildRobots(isProduction: boolean): string {
  if (isProduction) {
    return `User-agent: *
Allow: /

Sitemap: ${config.host}/sitemap.xml
`
  }

  return `User-agent: *
Disallow: /

Sitemap: ${config.host}/sitemap.xml
`
}

function buildSitemap(siteMap: Awaited<ReturnType<typeof getSiteMap>>): string {
  const urls = [
    `${config.host}`,
    `${config.host}/`,
    ...Object.keys(siteMap.canonicalPageMap).map(
      (canonicalPagePath) => `${config.host}/${canonicalPagePath}`
    )
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`
}

function buildFeed(siteMap: Awaited<ReturnType<typeof getSiteMap>>): string {
  const feed = new RSS({
    title: config.name,
    site_url: config.host,
    feed_url: `${config.host}/feed.xml`,
    language: config.language,
    ttl: 24 * 60
  })

  for (const pagePath of Object.keys(siteMap.canonicalPageMap)) {
    const pageId = siteMap.canonicalPageMap[pagePath]!
    const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap
    if (!recordMap) continue

    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]!]?.value
    if (!block) continue

    const parentPage = getBlockParentPage(block, recordMap)
    const isBlogPost =
      block.type === 'page' &&
      block.parent_table === 'collection' &&
      parentPage?.id === idToUuid(config.rootNotionPageId)
    if (!isBlogPost) continue

    const title = getBlockTitle(block, recordMap) || config.name
    const description =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description
    const url = getCanonicalPageUrl(config.site, recordMap)(pageId)
    const lastUpdatedTime = getPageProperty<number>(
      'Last Updated',
      block,
      recordMap
    )
    const publishedTime = getPageProperty<number>('Published', block, recordMap)
    const date = lastUpdatedTime
      ? new Date(lastUpdatedTime)
      : publishedTime
        ? new Date(publishedTime)
        : new Date()

    feed.item({ title, url, date, description })
  }

  return feed.xml({ indent: true })
}

main().catch((err) => {
  console.error('generate-static-files failed:', err)
  process.exit(1)
})
