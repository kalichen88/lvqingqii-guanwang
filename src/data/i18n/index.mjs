/**
 * 数据层多语言覆盖 / Data overrides
 * ---------------------------------------------------------------------------
 * 原始数据以「中文 + 英文」双语字段维护（nameZh / nameEn …）。
 * 其余语言（日本語 · Русский · العربية）通过这里的覆盖表注入，
 * 数据文件本身不必改动。
 */
import ja from './ja.mjs'
import ru from './ru.mjs'
import ar from './ar.mjs'

/** 语言 -> 覆盖表 */
export const dataOverrides = { ja, ru, ar }

/** 覆盖字段名后缀 */
export const FIELD_SUFFIX = { ja: 'Ja', ru: 'Ru', ar: 'Ar' }

/**
 * 把覆盖内容写回数据对象：{ name: '…' } -> obj.nameJa = '…'
 * 数组字段（highlights / points）同样支持。
 */
export function applyOverrides(collection, kind) {
  if (!Array.isArray(collection)) return collection
  const bySlug = new Map(collection.map((x) => [x.slug, x]))
  for (const [lang, table] of Object.entries(dataOverrides)) {
    const suffix = FIELD_SUFFIX[lang]
    const bucket = table?.[kind]
    if (!bucket) continue
    for (const [slug, fields] of Object.entries(bucket)) {
      const target = bySlug.get(slug)
      if (!target) continue
      for (const [field, value] of Object.entries(fields)) {
        target[field + suffix] = value
      }
    }
  }
  return collection
}
