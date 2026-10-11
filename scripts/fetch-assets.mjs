/**
 * fetch-assets.mjs
 * ---------------------------------------------------------------------------
 * 把官网上要用的图片素材下载到本地 public/ 目录，避免正式站点直接外链供应商域名
 * （外链会受对方站点带宽/防盗链/HTTP-Mixed-Content 影响，也不利于 EdgeOne 缓存）。
 *
 * 下载内容：
 *   1) public/media/**        企业环境 / 车间 / 荣誉证书 / 应用领域图标 / 分类配图
 *   2) public/catalog/**      产品缩略图（来自 products.generated.json）
 *
 * 用法：
 *   node scripts/fetch-assets.mjs            # 企业素材 + 产品图
 *   node scripts/fetch-assets.mjs --media    # 仅企业素材
 *   node scripts/fetch-assets.mjs --catalog  # 仅产品图
 *   node scripts/fetch-assets.mjs --limit=300
 * ---------------------------------------------------------------------------
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import { dirname, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLIC = resolve(ROOT, 'public')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)
const ONLY_MEDIA = 'media' in args
const ONLY_CATALOG = 'catalog' in args
const LIMIT = Number(args.limit ?? 5000)
const DELAY_MS = Number(args.delay ?? 60)
const CONCURRENCY = Number(args.concurrency ?? 6)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ----------------------------- 企业素材清单 ------------------------------ */

/** 应用领域图标（产品详情页「适用范围」区块） */
const APPLICATIONS = [
  'yy_03', 'yy_05', 'yy_07', 'yy_12', 'yy_13', 'yy_14', 'yy_18', 'yy_19', 'yy_20',
  'y2_03', 'y2_05', 'y2_07', 'y2_12', 'y2_13', 'y2_14', 'y2_18', 'y2_19', 'y2_20',
]

/** 分类配图（首页产品矩阵） */
const CATEGORY_PICS = Array.from({ length: 21 }, (_, i) => `cp${i + 1}`)

/** 车间 / 企业环境实拍 */
const FACTORY = [
  '202603/c257fa360330b29', '202603/c002b39ef339a07', '202603/978d796e67dd442',
  '202603/22b0b72ca20e915', '202603/1258ce5d1737594', '202603/1bdb5aca568b6db',
  '202603/5a4877badb1c9', '202011/2a3725d4a66a', '202011/9a2d341975492e6',
  '202011/69697f556665fd6', '202011/28edde58beb0cc', '202011/9f56b081707c264',
]

/** 荣誉 / 专利证书 */
const HONORS = [
  '202011/648a157ef4fad9', '202011/6ba1e477139e3', '202011/549875c5edb4bfe',
  '202011/775195c1729c24', '202011/622b1489a705ba1', '202011/880595443418932',
  '202011/0c6b070ebc230e3', '202011/fc543eaa9d44d03', '202011/192fafc17ab196b',
  '202011/9b3984a1284ca86', '202011/b35f81ee220a06', '202011/d70b9628d680de4',
]

/** 客户 logo（合作客户墙）— 仅展示已公开的合作方标识 */
const CLIENTS = [
  '202103/a0ffb13772ed522', '202011/c075911575eb116',
  '202011/a02a1a415290287', '202011/d5cb245e266206',
]

const MEDIA_MANIFEST = [
  ...CATEGORY_PICS.map((n) => ({
    url: `https://filtersun.cn/static/default/web/images/${n}.jpg`,
    out: `media/categories/${n}.jpg`,
  })),
  ...APPLICATIONS.map((n) => ({
    url: `https://filtersun.cn/static/default/web/picture/${n}.jpg`,
    out: `media/applications/${n}.jpg`,
  })),
  ...FACTORY.map((p) => ({
    url: `https://filtersun.cn/uploadfile/${p}.jpg`,
    out: `media/factory/${p.split('/')[1]}.jpg`,
  })),
  ...HONORS.map((p) => ({
    url: `https://filtersun.cn/uploadfile/${p}.jpg`,
    out: `media/honors/${p.split('/')[1]}.jpg`,
  })),
  ...CLIENTS.map((p) => ({
    url: `https://filtersun.cn/uploadfile/${p}.jpg`,
    out: `media/clients/${p.split('/')[1]}.jpg`,
  })),
]

/* -------------------------------- 下载器 -------------------------------- */

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

const EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

async function download(url, outPath, { skipExisting = true } = {}) {
  const abs = resolve(PUBLIC, outPath)
  const base = abs.slice(0, -extname(abs).length)
  // 同一张图可能因 content-type 被存成不同扩展名，全部纳入检查
  const candidates = [abs, ...[...new Set(Object.values(EXT_BY_TYPE))].map((e) => base + e)]

  if (skipExisting) {
    for (const c of candidates) {
      if (await exists(c)) return { status: 'skip', path: c }
    }
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
          Referer: 'https://filtersun.cn/',
        },
        signal: AbortSignal.timeout(30_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 128) throw new Error(`文件过小 (${buf.length}B)`)

      // 按真实 content-type 修正扩展名（源站存在 .gif 实为 jpg 的情况）
      const ct = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
      const realExt = EXT_BY_TYPE[ct]
      const finalAbs = realExt ? base + realExt : abs

      await mkdir(dirname(finalAbs), { recursive: true })
      await writeFile(finalAbs, buf)
      return { status: 'ok', bytes: buf.length, path: finalAbs }
    } catch (err) {
      if (attempt === 3) return { status: 'fail', error: err.message }
      await sleep(500 * attempt)
    }
  }
}

/** 有限并发池 */
async function pool(items, worker, concurrency) {
  const results = []
  let i = 0
  const runners = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx)
      if (DELAY_MS) await sleep(DELAY_MS)
    }
  })
  await Promise.all(runners)
  return results
}

/* --------------------------------- 主流程 -------------------------------- */

async function runMedia() {
  console.log(`\n▶ 企业素材：${MEDIA_MANIFEST.length} 个文件`)
  let ok = 0, skip = 0, fail = 0
  await pool(
    MEDIA_MANIFEST,
    async (item) => {
      const r = await download(item.url, item.out)
      if (r.status === 'ok') ok++
      else if (r.status === 'skip') skip++
      else {
        fail++
        console.warn(`  ✗ ${item.out} — ${r.error}`)
      }
    },
    CONCURRENCY,
  )
  console.log(`  完成：新增 ${ok} / 已存在 ${skip} / 失败 ${fail}`)
}

async function runCatalog() {
  const dataPath = resolve(ROOT, 'src/data/products.generated.json')
  let data
  try {
    data = JSON.parse(await readFile(dataPath, 'utf8'))
  } catch {
    console.warn('  ! 未找到 src/data/products.generated.json，先执行 `pnpm crawl`')
    return
  }

  // 只下载每个件号的首张有效图（跳过 nothing.gif 占位图）
  const uniq = new Map()
  for (const p of data.products ?? []) {
    if (!p.image || /nothing\.gif$/i.test(p.image)) continue
    const m = /bigimg\/([^/]+)$/.exec(p.image)
    if (!m) continue
    const key = m[1]
    if (!uniq.has(key)) uniq.set(key, { key, url: p.image, out: `catalog/${key}` })
  }

  const list = [...uniq.values()].slice(0, LIMIT)
  console.log(`\n▶ 产品图：${list.length} 个文件（共 ${uniq.size} 张可用）`)

  /** 远程文件名 -> 本地 URL，写入 manifest 供站点解析 */
  const manifest = {}
  let ok = 0, skip = 0, fail = 0
  let done = 0

  await pool(
    list,
    async (item) => {
      const r = await download(item.url, item.out)
      if (r.status === 'ok') ok++
      else if (r.status === 'skip') skip++
      else fail++

      // 计算最终本地路径（download 可能按 content-type 修正了扩展名）
      if (r.status !== 'fail') {
        const abs = r.path ?? resolve(PUBLIC, item.out)
        manifest[item.key] = '/' + abs.slice(PUBLIC.length + 1).replace(/\\/g, '/')
      }

      if (++done % 100 === 0) process.stdout.write(`  … ${done}/${list.length}\n`)
    },
    CONCURRENCY,
  )

  const manifestPath = resolve(ROOT, 'src/data/catalog-images.json')
  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, JSON.stringify(manifest), 'utf8')

  console.log(`  完成：新增 ${ok} / 已存在 ${skip} / 失败 ${fail}`)
  console.log(`  图片映射表：src/data/catalog-images.json（${Object.keys(manifest).length} 条）`)
}

async function main() {
  await mkdir(PUBLIC, { recursive: true })
  if (!ONLY_CATALOG) await runMedia()
  if (!ONLY_MEDIA) await runCatalog()
  console.log('\n全部完成。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
