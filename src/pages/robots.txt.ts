/**
 * robots.txt — 由 site.config.mjs 动态生成
 * ---------------------------------------------------------------------------
 * 把 indexingEnabled 设为 false 时，会输出全站禁止收录，方便上线前预览。
 * 注意：这是 Astro 的静态端点（.ts），文件内容必须是纯 TypeScript，
 * 不能带 --- 前置分隔符。
 */
import type { APIRoute } from 'astro'
import siteConfig from '../../site.config.mjs'

export const GET: APIRoute = () => {
  const origin = siteConfig.url.replace(/\/+$/, '')

  const body = siteConfig.indexingEnabled
    ? [
        '# 允许所有搜索引擎抓取',
        'User-agent: *',
        'Allow: /',
        '',
        '# 构建产物与临时路径不抓取',
        'Disallow: /api/',
        'Disallow: /thanks/',
        '',
        `Sitemap: ${origin}/sitemap-index.xml`,
        '',
      ].join('\n')
    : ['# 站点尚未上线或正在调整，暂时禁止收录', 'User-agent: *', 'Disallow: /', ''].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
