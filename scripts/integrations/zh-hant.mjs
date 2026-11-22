/**
 * zh-hant 转换集成 / OpenCC post-processing
 * ---------------------------------------------------------------------------
 * 站点以简体中文为源语言。繁体中文（台灣/香港）版本在构建完成后，
 * 用 OpenCC（s2twp：简体 → 繁體 + 台灣正體用詞）把 HTML 文本节点与
 * 可读属性统一转成繁體，避免为同一段内容维护两份译稿。
 *
 * 只处理 <route>/... 下的 .html（默认 /zh-hant），其余目录不动。
 */

import fs from 'node:fs'
import path from 'node:path'
import * as OpenCC from 'opencc-js'

/** 需要转换的属性（只转人类可读文本，绝不动 href / src / class / id） */
const TEXT_ATTRS = ['title', 'alt', 'aria-label', 'placeholder', 'content']

export default function zhHant({ route = '/zh-hant', prefix = 'zh-hant' } = {}) {
  return {
    name: 'zh-hant-opencc',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = path.join(fileURLToPath(dir), prefix)
        if (!fs.existsSync(root)) {
          logger.warn(`zh-hant-opencc: ${root} 不存在，跳过`)
          return
        }

        const convert = OpenCC.Converter({ from: 'cn', to: 'twp' })
        const cache = new Map()
        const conv = (s) => {
          if (!s || !/[\u4e00-\u9fff]/.test(s)) return s
          const hit = cache.get(s)
          if (hit !== undefined) return hit
          const out = convert(s)
          cache.set(s, out)
          return out
        }

        const attrRe = new RegExp(`(${TEXT_ATTRS.join('|')})="([^"]*)"`, 'g')

        /** 转换单段 HTML：标签保留，标签之间的文本转繁體 */
        function convertHtml(html) {
          // 先处理可读属性
          let out = html.replace(attrRe, (m, name, value) => `${name}="${conv(value)}"`)
          // 再处理文本节点：按标签切分，只转非标签片段
          out = out
            .split(/(<[^>]*>)/)
            .map((seg, i) => (i % 2 === 1 ? seg : conv(seg)))
            .join('')
          return out
        }

        let files = 0
        let changed = 0
        const walk = (dirPath) => {
          for (const e of fs.readdirSync(dirPath, { withFileTypes: true })) {
            const p = path.join(dirPath, e.name)
            if (e.isDirectory()) walk(p)
            else if (e.name.endsWith('.html')) {
              files++
              const src = fs.readFileSync(p, 'utf8')
              const out = convertHtml(src)
              if (out !== src) {
                fs.writeFileSync(p, out, 'utf8')
                changed++
              }
            }
          }
        }
        walk(root)
        logger.info(`zh-hant-opencc: ${changed}/${files} 个页面已转为繁體（${route}）`)
      },
    },
  }
}

function fileURLToPath(u) {
  return u instanceof URL ? decodeURIComponent(u.pathname.replace(/^\/([A-Za-z]:)/, '$1')) : String(u)
}
