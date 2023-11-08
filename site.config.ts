import { siteConfig } from './lib/site-config'

export default siteConfig({
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '83a111181e8e410bb27948b61b73c2ec',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Schema Structured Syndication',
  domain: '3s-docs.org',
  author: 'Daniel Mathews',

  // open graph metadata (optional)
  description: 'Help build the next generation of media apps with the SSS (Schema Structured Syndication) protocol',

  // open graph metadata (optional)

  // social usernames (optional)
  twitter: null,
  github: null,
  linkedin: null,
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/comicseries-date': 'df934cbbe3d643ec80ec68fe20edbcfe',
    '/comicseries-genre': '5cbf121c556d46b3a3a1b75be120942c',
    '/comicseries-imagedetails': 'e20c0690a7124b8abba1e004e04415be',
    '/comicseries-contentrating': 'a740d9ff98324542a1b7a6ec03e609ae',
    '/comicseries-type': '6c51130eb3cd43c0be27de5cfc61d376',
    '/comicseries-language': 'a690b02a1d41497387f50c9076e49c84',
    '/comicseries-status': 'b25dcaa6c4ac49a99ccca37cec1ea07f',
    '/comicseries-layout': '9654104344a240d08820b8f144726dcc',
    '/creator-date': 'ea45186790894b0989f111f95a08b4db',
    '/creator-linkdetails': 'b56452493fbc4d04914e6bdcf0bb806b',
    '/creator-imagedetails': '562dc3abd57d4d56b737570fb30ea273',
    '/creator-country': '297dae67f6cf46cabf31d8dfc3735c4b',
    '/creator-contentrole': '6360b121b5064b92b941b100ba1fb60e',
  },
  // pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
  //   }
  // ]
})
