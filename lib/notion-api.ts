import { NotionAPI } from 'notion-client'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
  ofetchOptions: {
    // Notion's public API rate-limits aggressively (~3 RPS). Building all
    // pages in parallel from a static export easily trips that, so we retry
    // 5xx + 429 responses with exponential backoff.
    retry: 5,
    retryDelay: 2000,
    retryStatusCodes: [408, 425, 429, 500, 502, 503, 504]
  }
})
