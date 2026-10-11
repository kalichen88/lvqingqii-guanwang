/**
 * gen-brand-assets.mjs — 生成品牌静态素材
 * ---------------------------------------------------------------------------
 * 使用 sharp 程序化生成，避免引入设计工具依赖：
 *   public/favicon.svg             站点图标
 *   public/brand/logo.svg          横向 Logo（供结构化数据/邮件签名引用）
 *   public/brand/og-default.jpg    1200×630 社交分享图
 *   public/brand/apple-touch-icon.png
 *   public/brand/wechat-qr.png     微信二维码占位图（★ 请替换为真实二维码）
 *
 * 用法：node scripts/gen-brand-assets.mjs
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import siteConfig from '../site.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLIC = resolve(ROOT, 'public')

const { brand, principal } = siteConfig
const YEAR = new Date().getFullYear()

const exists = async (p) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** 六边形 Logo 标记（与 Logo.astro 保持一致） */
const markPath = (size, withDefs = true) => `
  ${withDefs ? `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#4A82FF"/><stop offset="55%" stop-color="#2F6BFF"/><stop offset="100%" stop-color="#12C4B5"/>
  </linearGradient></defs>` : ''}
  <path d="M20 2.6 34.5 11v18L20 37.4 5.5 29V11L20 2.6Z" fill="url(#g)"/>
  <g stroke="#fff" stroke-linecap="round" fill="none">
    <path d="M14 12.5v15" stroke-width="2.6" opacity=".95"/>
    <path d="M20 14.5v11" stroke-width="2.1" opacity=".8"/>
    <path d="M26 16.5v7" stroke-width="1.6" opacity=".62"/>
  </g>`

/* ------------------------------- favicon -------------------------------- */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
${markPath(40)}
</svg>`

/* ------------------------------ logo.svg -------------------------------- */
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 40" width="260" height="40">
${markPath(40)}
<text x="50" y="20" font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
      font-size="17" font-weight="600" fill="#0a0f19" letter-spacing="-0.4">${brand.shortNameZh}</text>
<text x="50" y="33" font-family="'JetBrains Mono', Consolas, monospace"
      font-size="9" font-weight="500" fill="#74809a" letter-spacing="2">${brand.shortNameEn}</text>
</svg>`

/* --------------------------- OG 分享图 1200×630 --------------------------- */
function ogSvg() {
  const W = 1200
  const H = 630
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05080e"/><stop offset="55%" stop-color="#0a0f19"/><stop offset="100%" stop-color="#101724"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.18" cy="0.08" r="0.85">
      <stop offset="0%" stop-color="#2F6BFF" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#2F6BFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.92" cy="0.95" r="0.7">
      <stop offset="0%" stop-color="#12C4B5" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#12C4B5" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A82FF"/><stop offset="55%" stop-color="#2F6BFF"/><stop offset="100%" stop-color="#12C4B5"/>
    </linearGradient>
    <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#bcd2ff"/><stop offset="100%" stop-color="#35e0d0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Logo 标记 -->
  <g transform="translate(80,72) scale(1.5)">
    <path d="M20 2.6 34.5 11v18L20 37.4 5.5 29V11L20 2.6Z" fill="url(#mk)"/>
    <g stroke="#fff" stroke-linecap="round" fill="none">
      <path d="M14 12.5v15" stroke-width="2.6" opacity=".95"/>
      <path d="M20 14.5v11" stroke-width="2.1" opacity=".8"/>
      <path d="M26 16.5v7" stroke-width="1.6" opacity=".62"/>
    </g>
  </g>
  <text x="148" y="112" font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="30" font-weight="700" fill="#ffffff" letter-spacing="-0.6">${brand.shortNameZh}</text>
  <text x="150" y="140" font-family="'JetBrains Mono', Consolas, monospace"
        font-size="14" font-weight="500" fill="#74809a" letter-spacing="5">${brand.shortNameEn}</text>

  <!-- 主标题 -->
  <text x="80" y="290" font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="66" font-weight="700" fill="url(#txt)" letter-spacing="-2">${brand.taglineZh}</text>
  <text x="80" y="350" font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="25" font-weight="400" fill="#a3adbe" letter-spacing="-0.3">${principal.nameZh}</text>
  <text x="80" y="392" font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="25" font-weight="400" fill="#74809a" letter-spacing="-0.3">${principal.facts.skuCount.toLocaleString()}+ SKU · ${principal.facts.yearsExperience} ${'年'} · ${principal.facts.exportCountries}+ ${'国家'}</text>

  <line x1="80" y1="452" x2="1120" y2="452" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>

  <!-- 认证标签 -->
  ${principal.certifications
    .slice(0, 4)
    .map((c, i) => {
      const x = 80 + i * 246
      return `<g transform="translate(${x},492)">
        <rect width="228" height="46" rx="10" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.13"/>
        <text x="114" y="29" text-anchor="middle" font-family="Inter, 'Segoe UI', sans-serif"
              font-size="15" font-weight="600" fill="#dbe7ff">${c}</text>
      </g>`
    })
    .join('')}

  <!-- 右下角年份水印 -->
  <text x="1120" y="596" text-anchor="end" font-family="'JetBrains Mono', Consolas, monospace"
        font-size="13" fill="#47536b" letter-spacing="2">AUTHORIZED DISTRIBUTOR · ${YEAR}</text>
</svg>`
}

/* --------------------------- 微信二维码占位图 --------------------------- */
function qrPlaceholderSvg() {
  const N = 25
  const cell = 14
  const pad = 22
  const size = N * cell + pad * 2

  // 用确定性伪随机画一个「像二维码」的图案，仅作占位
  let seed = 20260101
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  let rects = ''
  const finder = (ox, oy) => {
    rects += `<rect x="${pad + ox * cell}" y="${pad + oy * cell}" width="${cell * 7}" height="${cell * 7}" fill="#0a0f19"/>`
    rects += `<rect x="${pad + (ox + 1) * cell}" y="${pad + (oy + 1) * cell}" width="${cell * 5}" height="${cell * 5}" fill="#fff"/>`
    rects += `<rect x="${pad + (ox + 2) * cell}" y="${pad + (oy + 2) * cell}" width="${cell * 3}" height="${cell * 3}" fill="#0a0f19"/>`
  }
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue
      if (rnd() > 0.52) {
        rects += `<rect x="${pad + x * cell}" y="${pad + y * cell}" width="${cell}" height="${cell}" fill="#0a0f19"/>`
      }
    }
  }
  finder(0, 0)
  finder(N - 7, 0)
  finder(0, N - 7)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  ${rects}
  <rect x="${size / 2 - 46}" y="${size / 2 - 16}" width="92" height="32" rx="8" fill="#2F6BFF"/>
  <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle"
        font-family="Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="15" font-weight="700" fill="#ffffff">占位图</text>
</svg>`
}

/* --------------------------------- 输出 --------------------------------- */
async function main() {
  await mkdir(resolve(PUBLIC, 'brand'), { recursive: true })

  await writeFile(resolve(PUBLIC, 'favicon.svg'), faviconSvg, 'utf8')
  await writeFile(resolve(PUBLIC, 'brand/logo.svg'), logoSvg, 'utf8')
  console.log('  ✓ public/favicon.svg')
  console.log('  ✓ public/brand/logo.svg')

  // OG 图
  const og = await sharp(Buffer.from(ogSvg())).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
  await writeFile(resolve(PUBLIC, 'brand/og-default.jpg'), og)
  console.log(`  ✓ public/brand/og-default.jpg (${(og.length / 1024).toFixed(0)}KB)`)

  // apple-touch-icon / favicon.ico
  const iconPng = await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toBuffer()
  await writeFile(resolve(PUBLIC, 'brand/apple-touch-icon.png'), iconPng)
  const ico32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer()
  await writeFile(resolve(PUBLIC, 'favicon.ico'), ico32)
  console.log('  ✓ public/brand/apple-touch-icon.png, public/favicon.ico')

  // 微信二维码：已存在真实文件则跳过，避免覆盖
  const qrPath = resolve(PUBLIC, 'brand/wechat-qr.png')
  if (await exists(qrPath)) {
    console.log('  · public/brand/wechat-qr.png 已存在，跳过（保留你的真实二维码）')
  } else {
    const qr = await sharp(Buffer.from(qrPlaceholderSvg())).png().toBuffer()
    await writeFile(qrPath, qr)
    console.log('  ✓ public/brand/wechat-qr.png（占位图，请替换为真实微信二维码）')
  }

  console.log('\n品牌素材生成完成。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
