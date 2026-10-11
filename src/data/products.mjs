/**
 * 产品数据层 / Product data layer
 * ---------------------------------------------------------------------------
 * 把 scripts/crawl-catalog.mjs 抓到的原始数据加工成站点可直接用的结构：
 *   - 补上本地图片地址（src/data/catalog-images.json）
 *   - 归类到大类（src/data/groups.mjs）
 *   - 提供查询 / 检索 / 相关推荐等辅助函数
 */

import raw from './products.generated.json'
import imageManifest from './catalog-images.json'
import { groups, groupBySlug, groupByCatid, typeEn } from './groups.mjs'
import siteConfig from '../../site.config.mjs'

/** 源站图片文件名 -> 本地路径 */
const localImage = (remoteUrl) => {
  if (!remoteUrl) return null
  const m = /bigimg\/([^/]+)$/.exec(remoteUrl)
  if (!m) return null
  return imageManifest[m[1]] ?? null
}

/**
 * 把件号转成 URL 安全且唯一的 slug。
 * 部分件号含 `/`、空格、中文括号（如 "HE0820/1"、"PL420/270油杯"），
 * 直接放进路径会破坏路由，这里统一替换为 `-`。
 * 若替换后仍冲突（极少见），追加产品 id 保证唯一。
 */
function makeSlug(partNo, id, taken) {
  let s = String(partNo)
    .trim()
    .replace(/[/\\?#%"'<>|:*；;，,。.]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!s) s = `pn-${id}`
  const key = s.toLowerCase()
  if (taken.has(key)) s = `${s}-${id}`
  taken.add(s.toLowerCase())
  return s
}

const takenSlugs = new Set()

/**
 * 判定某个件号是否值得生成独立详情页。
 * 规则见 site.config.mjs 的 productPagePolicy。
 * 未生成详情页的件号依然会出现在「件号查询」与大类清单中，只是不单独成页，
 * 避免产生大量只有一行文字的「薄内容页」。
 */
const policy = siteConfig.productPagePolicy ?? 'complete'
function shouldBuildPage(hasImage, spec, partNo) {
  const hasSpec = Boolean(spec) && spec !== partNo
  if (policy === 'all') return true
  if (policy === 'withImage') return hasImage
  return hasImage || hasSpec // 'complete'
}

/** 归一化后的产品列表 */
export const products = (raw.products ?? []).map((p) => {
  const groupSlug = groupByCatid[p.categoryId] ?? p.group ?? 'industrial'
  const spec = p.spec ?? ''
  const image = localImage(p.image)
  return {
    id: p.id,
    partNo: p.partNo,
    /** URL 中使用的 slug（多数情况下等于件号本身） */
    slug: makeSlug(p.partNo, p.id, takenSlugs),
    /** 规格尺寸，可能为空字符串 */
    spec,
    /** 中文产品类型 */
    type: p.type ?? '',
    /** 英文产品类型 */
    typeEn: typeEn(p.type ?? ''),
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    /** 大类 slug */
    group: groupSlug,
    /** 本地图片路径，没有则为 null（由组件回退到占位图） */
    image,
    /** 是否生成独立详情页（未生成时列表页不输出链接，改为「询价」入口） */
    hasPage: shouldBuildPage(Boolean(image), spec, p.partNo),
    /** 供应商原始详情页（用于人工核对，不在前台展示） */
    sourceUrl: p.url,
    /** 供搜索用的合并索引串 */
    _search: [p.partNo, spec, p.type, typeEn(p.type ?? ''), p.categoryName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  }
})

/** 需要生成详情页的件号 */
export const pageProducts = products.filter((p) => p.hasPage)

export const productCount = products.length
export const groupCount = groups.length
export const categoryCount = new Set(products.map((p) => p.categoryId)).size
export const typeCount = new Set(products.map((p) => p.type).filter(Boolean)).size

/** 有独立图片的件号数量 */
export const withImageCount = products.filter((p) => p.image).length

/** 有规格尺寸的件号数量 */
export const withSpecCount = products.filter((p) => p.spec && p.spec !== p.partNo).length

/** 详情页数量 */
export const pageProductCount = pageProducts.length

/* ------------------------------ 索引与查询 ------------------------------ */

const byPartNo = new Map()
for (const p of products) if (!byPartNo.has(p.partNo)) byPartNo.set(p.partNo, p)

const bySlug = new Map()
for (const p of products) if (!bySlug.has(p.slug)) bySlug.set(p.slug, p)

/** 按件号精确取（大小写不敏感） */
export const getByPartNo = (partNo) =>
  byPartNo.get(String(partNo ?? '').toUpperCase()) ?? null

/** 按 URL slug 取 */
export const getBySlug = (slug) => bySlug.get(String(slug ?? '')) ?? null

const byGroup = new Map()
for (const p of products) {
  const list = byGroup.get(p.group) ?? []
  list.push(p)
  byGroup.set(p.group, list)
}

/** 取某大类下全部产品 */
export const getByGroup = (slug) => byGroup.get(slug) ?? []

/** 大类统计（件号数 / 品类数 / 代表件号） */
export const groupStats = Object.fromEntries(
  groups.map((g) => {
    const list = getByGroup(g.slug)
    const types = [...new Set(list.map((p) => p.type).filter(Boolean))]
    return [
      g.slug,
      {
        count: list.length,
        types,
        typeCount: types.length,
        withImage: list.filter((p) => p.image).length,
        /** 取有图的 4 个作为代表 */
        samples: list.filter((p) => p.image).slice(0, 4),
      },
    ]
  }),
)

/** 某大类下的细分品类（含数量），按数量倒序 */
export const getTypesOfGroup = (slug) => {
  const m = new Map()
  for (const p of getByGroup(slug)) {
    if (!p.type) continue
    const e = m.get(p.type) ?? { zh: p.type, en: p.typeEn, count: 0 }
    e.count++
    m.set(p.type, e)
  }
  return [...m.values()].sort((a, b) => b.count - a.count)
}

/** 取某大类的代表件号（用于首页卡片展示，优先取有详情页且有图的） */
export const getGroupSamples = (slug, limit = 6) => {
  const list = getByGroup(slug)
  const rank = (p) => (p.hasPage ? 0 : 2) + (p.image ? 0 : 1)
  return [...list].sort((a, b) => rank(a) - rank(b)).slice(0, limit)
}

/** 相关件号推荐：优先同品类、再同大类；有详情页、有图的排前面 */
export const getRelated = (product, limit = 8) => {
  if (!product) return []
  const sameType = getByGroup(product.group).filter(
    (p) => p.partNo !== product.partNo && p.type === product.type,
  )
  const sameGroup = getByGroup(product.group).filter(
    (p) => p.partNo !== product.partNo && p.type !== product.type,
  )
  const rank = (p) => (p.hasPage ? 0 : 2) + (p.image ? 0 : 1)
  const pool = [...sameType, ...sameGroup]
  pool.sort((a, b) => rank(a) - rank(b))
  return pool.slice(0, limit)
}

/**
 * 检索：支持多个关键词（空格分隔），全部命中才算匹配（AND 语义）。
 * 排序优先级：件号完全等于 > 件号前缀 > 件号包含 > 其他字段包含
 */
export function searchProducts(query, { group = '', type = '', limit = 0 } = {}) {
  const terms = String(query ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  let pool = products
  if (group) pool = pool.filter((p) => p.group === group)
  if (type) pool = pool.filter((p) => p.type === type)
  if (!terms.length) return limit ? pool.slice(0, limit) : pool

  const scored = []
  for (const p of pool) {
    let ok = true
    let score = 0
    const pn = p.partNo.toLowerCase()
    for (const term of terms) {
      if (!p._search.includes(term)) {
        ok = false
        break
      }
      if (pn === term) score += 1000
      else if (pn.startsWith(term)) score += 500
      else if (pn.includes(term)) score += 300
      else if (p.type.toLowerCase().includes(term)) score += 120
      else score += 40
    }
    if (ok) scored.push({ p, score })
  }

  scored.sort((a, b) => b.score - a.score || a.p.partNo.localeCompare(b.p.partNo))
  const out = scored.map((s) => s.p)
  return limit ? out.slice(0, limit) : out
}

/**
 * 件号首字母导航。
 * 注意：少数件号以中文开头（如「卧式100HP总成…」），如果全部列出会让 A-Z
 * 导航膨胀到 40+ 个不可用的按钮，因此这里只保留：
 *   - 拉丁字母与 0-9
 *   - 且该首字母下有 ≥ MIN_PER_INITIAL 个件号
 */
const MIN_PER_INITIAL = 3

export const partNoInitials = (() => {
  const counts = new Map()
  for (const p of products) {
    const ch = p.partNo[0] ?? ''
    if (/[0-9]/.test(ch)) {
      counts.set('0-9', (counts.get('0-9') ?? 0) + 1)
    } else if (/[A-Za-z]/.test(ch)) {
      const k = ch.toUpperCase()
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    // 中文/符号开头的件号不进导航（仍可通过搜索找到）
  }

  const keys = [...counts.entries()]
    .filter(([, n]) => n >= MIN_PER_INITIAL)
    .map(([k]) => k)

  return keys.sort((a, b) => (a === '0-9' ? -1 : b === '0-9' ? 1 : a.localeCompare(b)))
})()

/** 站点上可直接访问的件号（用于静态路由生成） */
export const routableSlugs = products.map((p) => p.slug)

export { groups, groupBySlug, typeEn }
export default products
