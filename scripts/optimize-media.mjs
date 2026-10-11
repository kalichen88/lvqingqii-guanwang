/**
 * optimize-media.mjs — 压缩 public/media 里体积过大的图片
 * ---------------------------------------------------------------------------
 * 源站原图未压缩（部分 600–700KB）。这里用 sharp 统一限制长边并重新编码，
 * 显著降低首屏体积，同时保留视觉质量。产品缩略图（public/catalog）本身很小，
 * 不在处理范围内。
 *
 * 用法：
 *   node scripts/optimize-media.mjs               # 处理 >200KB 的图，长边限 1800
 *   node scripts/optimize-media.mjs --min=100 --max-edge=1600 --quality=80
 *   node scripts/optimize-media.mjs --dry         # 只报告不写入
 * ---------------------------------------------------------------------------
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)

/**
 * 多个目标目录，各自设置不同的压缩参数：
 *  - media/    企业照片、证书，长边 1800、质量 82
 *  - catalog/  产品缩略图（卡片上最大显示约 400px），长边 900、质量 78 足够
 */
const TARGETS = {
  media: { dir: 'public/media', maxEdge: 1800, quality: 82, minKB: 200 },
  catalog: { dir: 'public/catalog', maxEdge: 900, quality: 78, minKB: 12 },
}

const TARGET_KEY = args.target ?? null
const activeTargets = TARGET_KEY
  ? [TARGETS[TARGET_KEY]].filter(Boolean)
  : Object.values(TARGETS)

const MAX_EDGE_OVERRIDE = args['max-edge'] ? Number(args['max-edge']) : null
const QUALITY_OVERRIDE = args.quality ? Number(args.quality) : null
const MIN_BYTES_OVERRIDE = args.min ? Number(args.min) * 1024 : null
const DRY = 'dry' in args

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

async function runTarget({ dir, maxEdge, quality, minKB }) {
  const TARGET = resolve(ROOT, dir)
  const MAX_EDGE = MAX_EDGE_OVERRIDE ?? maxEdge
  const QUALITY = QUALITY_OVERRIDE ?? quality
  const MIN_BYTES = MIN_BYTES_OVERRIDE ?? minKB * 1024

  const files = await walk(TARGET)
  let before = 0
  let after = 0
  let processed = 0
  let skipped = 0
  let failed = 0
  const failures = []
  /** 旧路径 -> 新路径（扩展名变化时记录，用于回写图片映射表） */
  const renames = new Map()

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) continue

    const label = file.replace(ROOT, '')

    try {
      const info = await stat(file)
      before += info.size
      if (info.size < MIN_BYTES) {
        after += info.size
        continue
      }

      // 先把源文件完整读进内存：libvips 在 Windows 上会持有文件句柄，
      // 若直接对同一路径 writeFile 会触发 sharing violation（UNKNOWN error）。
      const src = await readFile(file)
      const meta = await sharp(src, { animated: false }).metadata()
      const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE

      let pipeline = sharp(src, { animated: false }).rotate()
      if (needsResize) {
        pipeline = pipeline.resize({
          width: MAX_EDGE,
          height: MAX_EDGE,
          fit: 'inside',
          withoutEnlargement: true,
        })
      }

      // 证书类 PNG 保留 PNG（文字锐利）；GIF/WebP 一律转 JPEG（体积小得多，
      // 且静态产品图用 GIF 没有意义）。扩展名变化会记录到 renames 里回写映射表。
      const keepPng = ext === '.png'
      const buf = await (keepPng
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      ).toBuffer()

      if (buf.length < info.size) {
        const target = keepPng ? file : file.slice(0, -ext.length) + '.jpg'
        if (!DRY) {
          await writeFile(target, buf)
          if (target !== file) {
            const { unlink } = await import('node:fs/promises')
            await unlink(file)
            renames.set(file, target)
          }
        }
        after += buf.length
        processed++
        if (processed % 200 === 0) process.stdout.write(`  … ${processed} processed\n`)
      } else {
        after += info.size
        skipped++
      }
    } catch (err) {
      failed++
      failures.push(`${label} — ${err.message}`)
      try {
        after += (await stat(file)).size
      } catch {
        /* ignore */
      }
    }
  }

  // 若扩展名发生变化，同步更新 src/data/catalog-images.json，否则站点会引用到不存在的文件
  if (renames.size && dir.includes('catalog') && !DRY) {
    const manifestPath = resolve(ROOT, 'src/data/catalog-images.json')
    try {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
      let patched = 0
      for (const [key, value] of Object.entries(manifest)) {
        const abs = resolve(ROOT, 'public' + value)
        if (renames.has(abs)) {
          manifest[key] = '/' + renames.get(abs).slice(resolve(ROOT, 'public').length + 1).replace(/\\/g, '/')
          patched++
        }
      }
      await writeFile(manifestPath, JSON.stringify(manifest), 'utf8')
      console.log(`  ↻ catalog-images.json 已更新 ${patched} 条路径（扩展名变化）`)
    } catch (e) {
      console.warn(`  ! 更新 catalog-images.json 失败：${e.message}`)
    }
  }

  console.log(
    `\n[${dir}] 处理 ${processed}｜跳过 ${skipped}｜失败 ${failed}\n  ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (节省 ${before ? (((before - after) / before) * 100).toFixed(1) : 0}%)`,
  )
  if (failures.length && failures.length <= 20) {
    console.log('  未能处理的文件（不影响使用）：')
    for (const f of failures) console.log(`    ! ${f}`)
  }
  return { before, after }
}

async function main() {
  let before = 0
  let after = 0
  for (const t of activeTargets) {
    const r = await runTarget(t)
    before += r.before
    after += r.after
  }
  if (activeTargets.length > 1) {
    console.log(
      `\n合计：${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (节省 ${before ? (((before - after) / before) * 100).toFixed(1) : 0}%)`,
    )
  }
  console.log(DRY ? '[dry-run，未写入]' : '')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
