/**
 * sync-catalog.mjs — 一键同步厂家件号目录（供本地与 GitHub Actions 使用）
 * ===========================================================================
 * 做什么：
 *   1. 备份当前 products.generated.json（用于对比与回滚）
 *   2. 全量重抓厂家「件号查询」目录
 *   3. 与旧数据对比，输出 新增 / 删除 / 规格变更 明细
 *   4. 下载新增的产品图（已存在的自动跳过）
 *   5. 压缩图片并同步更新 src/data/catalog-images.json
 *   6. 输出变更摘要；有变更时退出码为 0，无变更时为 0（由 CI 判断 git diff）
 *
 * 安全阀：如果本次抓取数量比上次少 20% 以上，判定为「厂家站点异常」，
 *        保留旧数据并退出码 2，避免把线上目录清空。
 *
 * 用法：
 *   node scripts/sync-catalog.mjs                # 完整同步
 *   node scripts/sync-catalog.mjs --dry          # 只抓取并对比，不下载图片
 *   node scripts/sync-catalog.mjs --pages=200    # 指定每分类最大页数
 *   node scripts/sync-catalog.mjs --force        # 忽略 20% 安全阀
 * ===========================================================================
 */

import { spawn } from 'node:child_process'
import { readFile, writeFile, copyFile, access } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA = resolve(ROOT, 'src/data/products.generated.json')
const BACKUP = resolve(ROOT, 'src/data/.products.backup.json')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)
const DRY = 'dry' in args
const FORCE = 'force' in args
const PAGES = args.pages ? String(args.pages) : '200'

const log = (msg) => console.log(`\n\x1b[36m▸ ${msg}\x1b[0m`)
const ok = (msg) => console.log(`\x1b[32m✔ ${msg}\x1b[0m`)
const warn = (msg) => console.log(`\x1b[33m! ${msg}\x1b[0m`)
const bad = (msg) => console.log(`\x1b[31m✘ ${msg}\x1b[0m`)

/** 运行子脚本（stdio: inherit —— 沙箱环境下不能用管道捕获子进程输出） */
function run(script, extraArgs = []) {
  return new Promise((res, rej) => {
    const child = spawn(process.execPath, [resolve(ROOT, 'scripts', script), ...extraArgs], {
      cwd: ROOT,
      stdio: 'inherit',
    })
    child.on('close', (code) => (code === 0 ? res() : rej(new Error(`${script} 退出码 ${code}`))))
    child.on('error', rej)
  })
}

const exists = async (p) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function loadJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

/** 计算两份目录的差异 */
function diff(oldList = [], newList = []) {
  const oldMap = new Map(oldList.map((p) => [p.partNo, p]))
  const newMap = new Map(newList.map((p) => [p.partNo, p]))

  const added = []
  const removed = []
  const specChanged = []
  const typeChanged = []
  const imageAdded = []

  for (const [no, p] of newMap) {
    const prev = oldMap.get(no)
    if (!prev) {
      added.push(p)
      continue
    }
    if ((prev.spec ?? '') !== (p.spec ?? '')) {
      specChanged.push({ partNo: no, from: prev.spec ?? '', to: p.spec ?? '' })
    }
    if ((prev.type ?? '') !== (p.type ?? '')) {
      typeChanged.push({ partNo: no, from: prev.type ?? '', to: p.type ?? '' })
    }
    const hadImg = Boolean(prev.image) && !/nothing\.gif$/i.test(prev.image)
    const hasImg = Boolean(p.image) && !/nothing\.gif$/i.test(p.image)
    if (!hadImg && hasImg) imageAdded.push(p)
  }

  for (const no of oldMap.keys()) if (!newMap.has(no)) removed.push(oldMap.get(no))

  return { added, removed, specChanged, typeChanged, imageAdded }
}

function printDiff(d, oldCount, newCount) {
  console.log('\n' + '─'.repeat(64))
  console.log('  件号目录变更摘要')
  console.log('─'.repeat(64))
  console.log(`  上次件号数 : ${oldCount.toLocaleString()}`)
  console.log(`  本次件号数 : ${newCount.toLocaleString()}`)
  console.log(`  新增       : ${d.added.length}`)
  console.log(`  删除/下架  : ${d.removed.length}`)
  console.log(`  规格变更   : ${d.specChanged.length}`)
  console.log(`  品类变更   : ${d.typeChanged.length}`)
  console.log(`  新增实物图 : ${d.imageAdded.length}`)
  console.log('─'.repeat(64))

  const show = (title, rows, fmt) => {
    if (!rows.length) return
    console.log(`\n  ${title}（最多显示 30 条）：`)
    for (const r of rows.slice(0, 30)) console.log('    ' + fmt(r))
    if (rows.length > 30) console.log(`    … 其余 ${rows.length - 30} 条`)
  }

  show('新增件号', d.added, (p) => `+ ${p.partNo}  ${p.spec || '—'}  ${p.type || ''}`)
  show('删除件号', d.removed, (p) => `- ${p.partNo}  ${p.spec || '—'}`)
  show('规格变更', d.specChanged, (r) => `~ ${r.partNo}  "${r.from}" → "${r.to}"`)
  show('品类变更', d.typeChanged, (r) => `~ ${r.partNo}  "${r.from}" → "${r.to}"`)

  const total =
    d.added.length + d.removed.length + d.specChanged.length + d.typeChanged.length + d.imageAdded.length
  console.log(`\n  合计变更项：${total}\n`)
  return total
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════')
  console.log('  富滤盛件号目录同步')
  console.log('════════════════════════════════════════════════════════════')

  /* ---------- 1. 备份旧数据 ---------- */
  const old = await loadJson(DATA)
  const oldCount = old?.products?.length ?? 0
  if (old) {
    await copyFile(DATA, BACKUP)
    ok(`已备份旧数据（${oldCount.toLocaleString()} 条）→ src/data/.products.backup.json`)
  } else {
    warn('未找到旧数据，将作为首次抓取')
  }

  /* ---------- 2. 抓取 ---------- */
  log(`抓取厂家目录（每分类最多 ${PAGES} 页）…`)
  await run('crawl-catalog.mjs', [`--pages=${PAGES}`])

  const fresh = await loadJson(DATA)
  const newCount = fresh?.products?.length ?? 0
  if (!newCount) {
    bad('抓取结果为空，已保留旧数据。请检查厂家站点是否可访问。')
    process.exit(2)
  }

  /* ---------- 3. 安全阀：数量骤降则回滚 ---------- */
  if (oldCount > 0 && newCount < oldCount * 0.8 && !FORCE) {
    bad(
      `本次仅抓到 ${newCount} 条，比上次 ${oldCount} 条少了 ${(100 - (newCount / oldCount) * 100).toFixed(1)}%，` +
        `判定为厂家站点异常，已回滚。`,
    )
    await copyFile(BACKUP, DATA)
    warn('如需强制接受本次结果，请加 --force 重跑。')
    process.exit(2)
  }

  /* ---------- 4. 对比 ---------- */
  const d = diff(old?.products ?? [], fresh.products)
  const total = printDiff(d, oldCount, newCount)

  if (DRY) {
    warn('--dry 模式：未下载图片、未压缩、未改动其他文件。')
    process.exit(0)
  }

  /* ---------- 5. 下载图片（已存在自动跳过） ---------- */
  log('下载产品图（仅新增，已存在自动跳过）…')
  try {
    await run('fetch-assets.mjs', ['--catalog'])
  } catch (e) {
    warn(`图片下载出现问题：${e.message}（不影响目录数据，可稍后重跑）`)
  }

  /* ---------- 6. 压缩图片并同步映射表 ---------- */
  log('压缩产品图并同步图片映射表…')
  try {
    await run('optimize-media.mjs', ['--target=catalog'])
  } catch (e) {
    warn(`图片压缩出现问题：${e.message}`)
  }

  /* ---------- 7. 写入同步记录 ---------- */
  const stamp = new Date().toISOString()
  const report = {
    syncedAt: stamp,
    previousCount: oldCount,
    currentCount: newCount,
    added: d.added.length,
    removed: d.removed.length,
    specChanged: d.specChanged.length,
    typeChanged: d.typeChanged.length,
    imageAdded: d.imageAdded.length,
  }
  await writeFile(
    resolve(ROOT, 'src/data/sync-report.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  )

  console.log('\n════════════════════════════════════════════════════════════')
  if (total === 0) {
    ok('目录无变化，无需重新部署。')
  } else {
    ok(`同步完成，共 ${total} 项变更。运行 pnpm build 重新生成站点。`)
  }
  console.log('  同步记录：src/data/sync-report.json')
  console.log('════════════════════════════════════════════════════════════\n')
}

main().catch((e) => {
  bad(e.message)
  process.exit(1)
})
