/**
 * catalog-report.mjs — 产品数据体检报告
 * ---------------------------------------------------------------------------
 * 抓完数据后跑一次，检查：分类覆盖、图片缺失、品类英文对照是否齐全。
 *   node scripts/catalog-report.mjs
 * ---------------------------------------------------------------------------
 */
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { groups, typeI18n } from '../src/data/groups.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const data = JSON.parse(
  await readFile(resolve(ROOT, 'src/data/products.generated.json'), 'utf8'),
)
const products = data.products ?? []

const pad = (s, n) => String(s).padEnd(n, ' ')
const padL = (s, n) => String(s).padStart(n)

console.log(`\n抓取时间：${data.generatedAt}`)
console.log(`件号总数：${products.length}\n`)

/* ---------------------------- 按大类统计 ---------------------------- */
const byGroup = new Map()
for (const p of products) {
  const g = byGroup.get(p.group) ?? { count: 0, types: new Set(), noImg: 0 }
  g.count++
  g.types.add(p.type)
  if (!p.image || /nothing\.gif$/i.test(p.image)) g.noImg++
  byGroup.set(p.group, g)
}

console.log('── 按大类 ───────────────────────────────────────────────')
console.log(`${pad('大类', 20)} ${padL('件号数', 8)} ${padL('品类数', 8)} ${padL('缺图', 8)}  英文名`)
for (const g of groups) {
  const s = byGroup.get(g.slug)
  if (!s) {
    console.log(`${pad(g.slug, 20)} ${padL('—', 8)} ${padL('—', 8)} ${padL('—', 8)}  ${g.nameEn}`)
    continue
  }
  console.log(
    `${pad(g.slug, 20)} ${padL(s.count, 8)} ${padL(s.types.size, 8)} ${padL(s.noImg, 8)}  ${g.nameEn}`,
  )
}

/* --------------------------- 未收录的类型 --------------------------- */
const allTypes = new Set(products.map((p) => p.type))
const missing = [...allTypes].filter((t) => t && !(t in typeI18n))

console.log(`\n── 品类英文对照 ──────────────────────────────────────────`)
console.log(`已收录 ${Object.keys(typeI18n).length} 条，实际出现 ${allTypes.size} 条`)
if (missing.length) {
  console.log(`\n以下 ${missing.length} 条缺少英文对照（会自动回退中文，建议补进 groups.mjs）：`)
  for (const t of missing.sort()) console.log(`  '${t}': '',`)
} else {
  console.log('✓ 全部品类均有英文对照')
}

/* ------------------------------ 健康度 ------------------------------ */
const noImg = products.filter((p) => !p.image || /nothing\.gif$/i.test(p.image)).length
const noSpec = products.filter((p) => !p.spec).length
const dupSpec = products.filter((p) => p.spec && p.spec === p.partNo).length

console.log(`\n── 数据健康度 ────────────────────────────────────────────`)
console.log(`缺图：${noImg} / ${products.length}  (${((noImg / products.length) * 100).toFixed(1)}%)`)
console.log(`缺规格：${noSpec}  (${((noSpec / products.length) * 100).toFixed(1)}%)`)
console.log(`规格为空占位：${dupSpec}`)
console.log(`独立件号：${new Set(products.map((p) => p.partNo)).size}`)
console.log()
