// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import siteConfig from './site.config.mjs'

// https://astro.build/config
export default defineConfig({
  /** 纯静态输出 —— 直接上传 dist/ 到腾讯云 EdgeOne 即可 */
  output: 'static',

  /** 站点根地址，用于生成 canonical / sitemap / JSON-LD（改 site.config.mjs 即可） */
  site: siteConfig.url,

  /** 统一带尾斜杠，保证 canonical 与 sitemap 一致，避免重复收录 */
  trailingSlash: 'always',

  build: {
    /** 目录式输出：/about/index.html */
    format: 'directory',
    /** 内联小体积 CSS，减少首屏请求 */
    inlineStylesheets: 'auto',
  },

  /** 预取站内链接，站内跳转近乎瞬时 */
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  compressHTML: true,

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en' },
      },
      filter: (page) => !page.includes('/404') && !page.includes('/thanks'),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      /** 路径别名：新文件建议用 @/ 引用，避免相对路径层级数错 */
      alias: {
        '@': new URL('./src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
        '@config': new URL('./site.config.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
      },
    },
    build: {
      /** 大站点下减少 chunk 抖动 */
      cssCodeSplit: true,
    },
  },

  devToolbar: { enabled: false },
})
