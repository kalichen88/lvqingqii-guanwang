/**
 * crawl-catalog.mjs
 * ---------------------------------------------------------------------------
 * 从富滤盛官方站 (filtersun.cn) 抓取「件号查询」产品目录，生成站点使用的
 * 本地产品数据文件：src/data/products.generated.json
 *
 * 用途：作为富滤盛授权代理，把供应商公开的件号 / 规格 / 品类数据本地化，
 *      用于官网的「件号查询」工具与产品详情页（利于 SEO 长尾收录）。
 *
 * 用法：
 *   node scripts/crawl-catalog.mjs               # 默认每分类最多 6 页
 *   node scripts/crawl-catalog.mjs --pages=113   # 抓全量（分类 90 共 113 页）
 *   node scripts/crawl-catalog.mjs --pages=3 --delay=400
 *
 * 说明：
 *   - 只读公开列表页，逐页串行 + 延迟，避免给对方站点造成压力。
 *   - 站点为 GBK/GB2312 编码，脚本自动识别并用 TextDecoder 解码。
 *   - 结果按件号去重后写入 JSON；不会覆盖手工维护的 src/data/products.curated.json
 * ---------------------------------------------------------------------------
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'src/data/products.generated.json')

const ORIGIN = 'https://filtersun.cn'

/**
 * 需要抓取的分类。
 * ⚠️ 关键点：厂家列表页是按「子分类」顺序排列的，如果只抓父分类（如 90 工程机械
 * 滤清器，共 113 页），前十几页会全是「空气滤芯」，拿不到品类多样性。
 * 因此这里直接抓叶子分类，既覆盖均匀，也让官网能生成真实的细分品类页。
 *
 * catid  厂家分类 id
 * group  归属大类 slug（见 src/data/groups.mjs）
 * parent 父分类名称（用于面包屑/分组展示）
 * pages  抓取页数，每页 20 条
 */
const CATEGORIES = [
  /* --- 工程机械 --- */
  { catid: 117, group: 'construction', parent: '工程机械滤清器', name: '空气滤芯', pages: 5 },
  { catid: 118, group: 'construction', parent: '工程机械滤清器', name: '空调滤芯', pages: 2 },
  { catid: 119, group: 'construction', parent: '工程机械滤清器', name: '液压回油滤芯', pages: 3 },
  { catid: 120, group: 'construction', parent: '工程机械滤清器', name: '旋装机油滤芯', pages: 3 },
  { catid: 121, group: 'construction', parent: '工程机械滤清器', name: '旋装柴油滤芯', pages: 3 },
  { catid: 159, group: 'construction', parent: '工程机械滤清器', name: '旋装液压滤', pages: 2 },
  { catid: 160, group: 'construction', parent: '工程机械滤清器', name: '旋装先导滤芯', pages: 2 },
  { catid: 161, group: 'construction', parent: '工程机械滤清器', name: '水滤芯', pages: 2 },
  { catid: 162, group: 'construction', parent: '工程机械滤清器', name: '铜网滤芯', pages: 2 },
  { catid: 163, group: 'construction', parent: '工程机械滤清器', name: '旋装管路滤', pages: 2 },
  { catid: 164, group: 'construction', parent: '工程机械滤清器', name: '先导滤芯', pages: 2 },
  { catid: 165, group: 'construction', parent: '工程机械滤清器', name: '纸质柴油滤芯', pages: 2 },
  { catid: 166, group: 'construction', parent: '工程机械滤清器', name: '纸质机油滤芯', pages: 2 },
  { catid: 126, group: 'construction', parent: '工程汽车滤清器', name: '工程汽车空气滤芯', pages: 2 },
  { catid: 127, group: 'construction', parent: '工程汽车滤清器', name: '工程汽车油滤芯', pages: 2 },
  { catid: 128, group: 'construction', parent: '工程汽车滤清器', name: '工程汽车旋装机油滤芯', pages: 2 },
  { catid: 129, group: 'construction', parent: '工程汽车滤清器', name: '工程汽车旋装柴油滤芯', pages: 2 },
  { catid: 131, group: 'construction', parent: '工程叉车滤清器', name: '叉车空气滤芯', pages: 2 },
  { catid: 132, group: 'construction', parent: '工程叉车滤清器', name: '叉车油滤芯', pages: 2 },

  /* --- 商用车 --- */
  { catid: 173, group: 'truck', parent: '商用车滤清器', name: '商用车机油滤清器', pages: 3 },
  { catid: 174, group: 'truck', parent: '商用车滤清器', name: '商用车柴油滤清器', pages: 3 },
  { catid: 175, group: 'truck', parent: '商用车滤清器', name: '商用车空气滤清器', pages: 3 },
  { catid: 176, group: 'truck', parent: '商用车滤清器', name: '商用车空调滤清器', pages: 2 },
  { catid: 177, group: 'truck', parent: '商用车滤清器', name: '天然气/尿素滤芯', pages: 2 },

  /* --- 空压机 --- */
  { catid: 136, group: 'compressor', parent: '空气压缩机滤清器', name: '空压机空气滤芯', pages: 3 },
  { catid: 137, group: 'compressor', parent: '空气压缩机滤清器', name: '油气分离滤芯', pages: 3 },
  { catid: 138, group: 'compressor', parent: '空气压缩机滤清器', name: '空压机旋装机油滤芯', pages: 2 },
  { catid: 139, group: 'compressor', parent: '空气压缩机滤清器', name: '精密滤芯系列', pages: 2 },
  { catid: 140, group: 'compressor', parent: '空气压缩机滤清器', name: 'EL系列精密滤芯', pages: 2 },

  /* --- 液压油滤芯 --- */
  { catid: 168, group: 'hydraulic', parent: '液压油滤芯', name: '液压油滤芯', pages: 3 },
  { catid: 130, group: 'hydraulic', parent: '工程汽车滤清器', name: '泵车液压油滤芯', pages: 2 },
  { catid: 145, group: 'hydraulic', parent: '注塑机滤芯', name: '注塑机吸油滤网', pages: 2 },
  { catid: 146, group: 'hydraulic', parent: '注塑机滤芯', name: '超精密油滤芯', pages: 2 },
  { catid: 147, group: 'hydraulic', parent: '注塑机滤芯', name: '注塑机液压油滤芯', pages: 2 },
  { catid: 102, group: 'hydraulic', parent: '高流量滤芯', name: '高流量滤芯', pages: 2 },

  /* --- 工业与精密 --- */
  { catid: 106, group: 'industrial', parent: '线切割机水滤芯', name: '线切割机水滤芯', pages: 2 },
  { catid: 107, group: 'industrial', parent: '火花机油滤芯', name: '火花机油滤芯', pages: 2 },
  { catid: 111, group: 'industrial', parent: '喷涂粉末回收滤芯', name: '喷涂粉末回收滤芯', pages: 2 },
  { catid: 155, group: 'industrial', parent: '其它滤芯', name: '异型滤清器', pages: 2 },
  { catid: 156, group: 'industrial', parent: '其它滤芯', name: '铜烧结滤芯', pages: 2 },
  { catid: 157, group: 'industrial', parent: '其它滤芯', name: '盘片滤芯', pages: 2 },
  { catid: 158, group: 'industrial', parent: '其它滤芯', name: '塑料机械用滤芯', pages: 2 },

  /* --- 净化与新风 --- */
  { catid: 141, group: 'purifier', parent: '空气隔尘网', name: '金属框高效隔层网', pages: 2 },
  { catid: 142, group: 'purifier', parent: '空气隔尘网', name: '板式粗效率隔层网', pages: 2 },
  { catid: 143, group: 'purifier', parent: '空气隔尘网', name: '袋式中效率隔层网', pages: 2 },
  { catid: 144, group: 'purifier', parent: '空气隔尘网', name: '折叠式中效率隔层网', pages: 2 },
  { catid: 110, group: 'purifier', parent: '纯水过滤器', name: '纯水过滤器', pages: 2 },
  { catid: 103, group: 'purifier', parent: '扫地机吸尘器滤芯', name: '扫地机吸尘器滤芯', pages: 2 },
  { catid: 104, group: 'purifier', parent: '电动口罩滤芯', name: '电动口罩滤芯', pages: 2 },

  /* --- 油水分离器与配件 --- */
  { catid: 94, group: 'separator', parent: '油水分离器', name: '油水分离器', pages: 2 },
  { catid: 148, group: 'separator', parent: '配件产品', name: '油水分离器系列', pages: 2 },
  { catid: 149, group: 'separator', parent: '配件产品', name: '柴油/机油格底座', pages: 2 },
  { catid: 150, group: 'separator', parent: '配件产品', name: '通用易损件系列', pages: 2 },
  { catid: 151, group: 'separator', parent: '配件产品', name: '集水杯（油杯）', pages: 2 },
  { catid: 152, group: 'separator', parent: '配件产品', name: '油格扳手系列', pages: 2 },
  { catid: 153, group: 'separator', parent: '配件产品', name: '柴油滤网', pages: 2 },
  { catid: 154, group: 'separator', parent: '配件产品', name: '浮子式水位传感器', pages: 2 },
  { catid: 95, group: 'separator', parent: '空滤总成', name: '空滤总成', pages: 2 },

  /* --- 发电机与农机 --- */
  { catid: 122, group: 'genset', parent: '发电机用滤芯', name: '发电机空气滤芯', pages: 2 },
  { catid: 123, group: 'genset', parent: '发电机用滤芯', name: '发电机油滤芯/油水分离', pages: 2 },
  { catid: 124, group: 'genset', parent: '发电机用滤芯', name: '发电机旋装机油滤芯', pages: 2 },
  { catid: 125, group: 'genset', parent: '发电机用滤芯', name: '发电机旋装柴油滤芯', pages: 2 },
  { catid: 101, group: 'genset', parent: '割草机滤芯', name: '割草机滤芯', pages: 2 },
  { catid: 99, group: 'genset', parent: '摩托车滤芯', name: '摩托车滤芯', pages: 2 },
  { catid: 100, group: 'genset', parent: '游艇滤芯', name: '游艇滤芯', pages: 2 },
]

/* ------------------------------- CLI 参数 ------------------------------- */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)

const MAX_PAGES_OVERRIDE = args.pages ? Number(args.pages) : null
const DELAY_MS = Number(args.delay ?? 250)
const ONLY = args.only ? String(args.only).split(',').map(Number) : null

/* -------------------------------- 工具函数 ------------------------------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** 抓取并按站点声明的字符集解码（站点为 GBK） */
async function fetchText(url, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(25_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = new Uint8Array(await res.arrayBuffer())
    const head = new TextDecoder('latin1').decode(buf.subarray(0, 2048))
    const cs = /charset\s*=\s*["']?([\w-]+)/i.exec(head)?.[1]?.toLowerCase()
    const encoding = !cs || cs === 'gb2312' || cs === 'gbk' ? 'gbk' : cs
    try {
      return new TextDecoder(encoding).decode(buf)
    } catch {
      return new TextDecoder('utf-8').decode(buf)
    }
  } catch (err) {
    if (attempt >= 3) throw err
    await sleep(800 * attempt)
    return fetchText(url, attempt + 1)
  }
}

/** 常见命名实体（源站规格字段大量使用 &Oslash; / &times; 等） */
const NAMED_ENTITIES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  Oslash: 'Ø', oslash: 'ø', times: '×', divide: '÷', deg: '°',
  sup2: '²', sup3: '³', middot: '·', hellip: '…', mdash: '—', ndash: '–',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', copy: '©', reg: '®',
  trade: '™', plusmn: '±', frac12: '½', frac14: '¼', micro: 'µ',
  bull: '•', dagger: '†', prime: '′', Prime: '″', infin: '∞', ne: '≠',
  le: '≤', ge: '≥', larr: '←', rarr: '→', uarr: '↑', darr: '↓',
}

const decodeEntities = (s) =>
  String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => NAMED_ENTITIES[name] ?? m)

const clean = (s) =>
  decodeEntities(String(s ?? ''))
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** 从列表页表格中解析产品行 */
function parseListPage(html, category) {
  const rows = []
  const trRe = /<tr[\s\S]*?<\/tr>/gi
  const trs = html.match(trRe) ?? []

  for (const tr of trs) {
    const idM = /c=show&(?:amp;)?id=(\d+)/i.exec(tr)
    if (!idM) continue
    const id = Number(idM[1])

    const imgM = /(?:src|data-original)=["']([^"']*bigimg[^"']*)["']/i.exec(tr)
    let image = imgM ? imgM[1].replace(/^http:/, 'https:') : ''
    // 源站占位图视为「无图」
    if (/nothing\.gif$/i.test(image)) image = ''

    /**
     * 表格列固定为：产品图片 | 富滤盛编号 | 规格 | 产品类型 | 详情
     * 必须按位置解析（保留空单元格），否则某列为空时会导致整行错位。
     */
    const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => clean(m[1]))
    if (tds.length < 4) continue

    const partNo = (tds[1] || '').toUpperCase()
    if (!partNo || partNo.length > 40 || /查看详情/.test(partNo)) continue

    let spec = tds[2] || ''
    let type = tds[3] || ''

    // 兜底：若位置解析结果异常，则回退到「在行内文本里找」
    if (!type || /查看详情/.test(type)) {
      const alt = tds.find((c) => c && c !== partNo && c !== spec && /[\u4e00-\u9fa5]/.test(c))
      type = alt && !/查看详情/.test(alt) ? alt : category.name
    }
    if (!spec) {
      spec = tds.find((c) => c && c !== partNo && c !== type && /[Øø*×\d]/.test(c)) ?? ''
    }
    // 规格里若只有型号本身，视为无规格
    if (spec.toUpperCase() === partNo) spec = ''

    rows.push({
      id,
      partNo,
      spec,
      /** 厂家表格里的产品类型（有时比分类更细，保留备查） */
      type,
      categoryId: category.catid,
      group: category.group,
      /** 本站使用的叶子品类名（人工整理的规范名） */
      categoryName: category.name,
      parentName: category.name === category.parent ? '' : category.parent,
      image,
      url: `${ORIGIN}/index.php?c=show&id=${id}`,
    })
  }
  return rows
}

/* --------------------------------- 主流程 -------------------------------- */

async function crawlCategory(category) {
  const maxPages = MAX_PAGES_OVERRIDE ?? category.pages ?? 6
  const found = new Map()
  const seenIds = new Set()

  for (let page = 1; page <= maxPages; page++) {
    const url = `${ORIGIN}/index.php?s=photo&c=search&catid=${category.catid}&page=${page}`
    let html
    try {
      html = await fetchText(url)
    } catch (err) {
      console.warn(`  ! [${category.catid}] 第 ${page} 页失败：${err.message}`)
      break
    }

    const rows = parseListPage(html, category).filter((r) => {
      if (seenIds.has(r.id)) return false
      seenIds.add(r.id)
      return true
    })
    if (rows.length === 0) break

    for (const r of rows) if (!found.has(r.partNo)) found.set(r.partNo, r)

    process.stdout.write(
      `  · [${category.catid}] ${category.name} p${page}/${maxPages} → +${rows.length}（累计 ${found.size}）\n`,
    )

    // 已经是最后一页（没有下一页链接）则提前结束
    if (!new RegExp(`catid=${category.catid}&(?:amp;)?page=${page + 1}`).test(html)) break

    await sleep(DELAY_MS)
  }

  console.log(`✓ [${category.catid}] ${category.name}：${found.size} 条`)
  return [...found.values()]
}

async function main() {
  const targets = ONLY ? CATEGORIES.filter((c) => ONLY.includes(c.catid)) : CATEGORIES
  const totalPages = targets.reduce((s, c) => s + (MAX_PAGES_OVERRIDE ?? c.pages ?? 6), 0)
  console.log(
    `开始抓取 ${targets.length} 个分类，合计最多 ${totalPages} 页，间隔 ${DELAY_MS}ms\n`,
  )

  const all = []
  for (const cat of targets) {
    all.push(...(await crawlCategory(cat)))
    await sleep(DELAY_MS)
  }

  // 全局按件号去重
  const byPartNo = new Map()
  for (const p of all) if (!byPartNo.has(p.partNo)) byPartNo.set(p.partNo, p)
  const products = [...byPartNo.values()].sort(
    (a, b) => a.categoryId - b.categoryId || a.partNo.localeCompare(b.partNo),
  )

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: `${ORIGIN} 件号查询`,
        count: products.length,
        products,
      },
      null,
      0,
    ),
    'utf8',
  )

  console.log(`\n共 ${products.length} 个件号 → ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
