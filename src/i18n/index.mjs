/**
 * 国际化 / i18n —— 6 语言
 * ---------------------------------------------------------------------------
 * 语言与 URL：
 *   zh       简体中文    /                 （默认语言，无前缀）
 *   en       English     /en/
 *   zh-hant  繁體中文    /zh-hant/
 *   ja       日本語      /ja/
 *   ru       Русский     /ru/
 *   ar       العربية     /ar/   ← RTL
 *
 * 文案来源：
 *   src/i18n/messages/<lang>.mjs   扁平键值（界面文案）
 *   src/i18n/meta.mjs              各页面 SEO 标题 / 描述
 *   src/i18n/copy/<lang>.mjs       页面正文长文案（分块）
 *   src/data/*.mjs                 业务数据（字段用 { zh, en, 'zh-hant', ja, ru, ar } 形式）
 */

import zhMsgs from './messages/zh.mjs'
import enMsgs from './messages/en.mjs'
import zhHantMsgs from './messages/zh-hant.mjs'
import jaMsgs from './messages/ja.mjs'
import ruMsgs from './messages/ru.mjs'
import arMsgs from './messages/ar.mjs'
import copyJa from './copy/ja.mjs'
import copyRu from './copy/ru.mjs'
import copyAr from './copy/ar.mjs'

/** @typedef {'zh' | 'en' | 'zh-hant' | 'ja' | 'ru' | 'ar'} Lang */

export const LANGS = /** @type {const} */ (['zh', 'en', 'zh-hant', 'ja', 'ru', 'ar'])
export const DEFAULT_LANG = 'zh'
/** 除默认语言外、需要 URL 前缀的语言 */
export const PREFIXED_LANGS = /** @type {const} */ (['en', 'zh-hant', 'ja', 'ru', 'ar'])

/**
 * 语言元信息
 * - htmlLang   <html lang="…">
 * - dir        ltr / rtl
 * - label      语言自称（语言切换器里显示）
 * - short      紧凑标签
 * - ogLocale   Open Graph og:locale
 * - intl       Intl.NumberFormat / DateTimeFormat 用的 locale
 * - weekStart  日历周起始（0=周日，1=周一，6=周六），用于日期展示与营业时间
 */
export const langMeta = {
  zh: {
    htmlLang: 'zh-CN',
    dir: 'ltr',
    label: '简体中文',
    short: '简',
    ogLocale: 'zh_CN',
    intl: 'zh-CN',
    weekStart: 1,
    contactChannel: 'wechat',
  },
  en: {
    htmlLang: 'en',
    dir: 'ltr',
    label: 'English',
    short: 'EN',
    ogLocale: 'en_US',
    intl: 'en-US',
    weekStart: 1,
    contactChannel: 'whatsapp',
  },
  'zh-hant': {
    htmlLang: 'zh-Hant',
    dir: 'ltr',
    label: '繁體中文',
    short: '繁',
    ogLocale: 'zh_TW',
    intl: 'zh-TW',
    weekStart: 0,
    contactChannel: 'whatsapp',
  },
  ja: {
    htmlLang: 'ja',
    dir: 'ltr',
    label: '日本語',
    short: 'JA',
    ogLocale: 'ja_JP',
    intl: 'ja-JP',
    weekStart: 0,
    contactChannel: 'whatsapp',
  },
  ru: {
    htmlLang: 'ru',
    dir: 'ltr',
    label: 'Русский',
    short: 'RU',
    ogLocale: 'ru_RU',
    intl: 'ru-RU',
    weekStart: 1,
    contactChannel: 'whatsapp',
  },
  ar: {
    htmlLang: 'ar',
    dir: 'rtl',
    label: 'العربية',
    short: 'AR',
    ogLocale: 'ar_AR',
    intl: 'ar',
    weekStart: 6,
    contactChannel: 'whatsapp',
  },
}

/* ==========================================================================
   语言工具
   ========================================================================== */

/** 是否从右到左排版 */
export function isRtl(lang) {
  return langMeta[lang]?.dir === 'rtl'
}

/** 是否中文（简体 / 繁体）—— 中文用系统 CJK 字体、中文标点、中文版品牌名 */
export function isCjk(lang) {
  return lang === 'zh' || lang === 'zh-hant'
}

/** 语言在 URL 上的前缀，默认语言为空串 */
export function langPrefix(lang) {
  return lang === DEFAULT_LANG ? '' : `/${lang}`
}

/**
 * 把站内路径本地化。
 * localizePath('/products/', 'en')      -> '/en/products/'
 * localizePath('/products/', 'zh-hant') -> '/zh-hant/products/'
 * localizePath('/', 'ja')              -> '/ja/'
 * localizePath('/products/', 'zh')     -> '/products/'
 */
export function localizePath(path, lang) {
  const clean = '/' + String(path ?? '/').replace(/^\/+/, '')
  if (lang === DEFAULT_LANG) return clean
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`
}

/**
 * 从 URL 路径判断语言。
 * '/en/about/' -> 'en'，'/ja/' -> 'ja'，'/products/' -> 'zh'
 */
export function langFromPath(pathname) {
  const m = /^\/([^/?#]+)(?:\/|$|[?#])/.exec(String(pathname || '/'))
  if (!m) return DEFAULT_LANG
  const seg = m[1].toLowerCase()
  const hit = PREFIXED_LANGS.find((l) => l === seg)
  return hit ?? DEFAULT_LANG
}

/**
 * 去掉语言前缀，拿到「中性路径」，用于语言切换与 hreflang。
 * '/en/about/' -> '/about/'，'/ja/' -> '/'
 */
export function neutralPath(pathname) {
  const p = String(pathname || '/')
  const lang = langFromPath(p)
  if (lang === DEFAULT_LANG) return p === '' ? '/' : p
  const stripped = p.replace(new RegExp(`^/${lang}(?=/|$)`, 'i'), '')
  return stripped === '' ? '/' : stripped
}

/** 生成另一语言版本的路径 */
export function altLangPath(pathname, target) {
  return localizePath(neutralPath(pathname), target)
}

/** 全部语言版本链接（供 hreflang / 语言切换器） */
export function alternateLinks(pathname) {
  return LANGS.map((lang) => ({
    lang,
    href: altLangPath(pathname, lang),
    hreflang: langMeta[lang].htmlLang,
    dir: langMeta[lang].dir,
    label: langMeta[lang].label,
    short: langMeta[lang].short,
  }))
}

/* ==========================================================================
   文案查表
   ========================================================================== */

const MESSAGES = {
  zh: zhMsgs,
  en: enMsgs,
  'zh-hant': zhHantMsgs,
  ja: jaMsgs,
  ru: ruMsgs,
  ar: arMsgs,
}

/** 回退链：优先本语言，其次英语，最后简体中文；繁體优先回退简体而非英文 */
function fallbackChain(lang) {
  if (lang === 'zh') return ['zh', 'en']
  if (lang === 'zh-hant') return ['zh-hant', 'zh', 'en']
  return [lang, 'en', 'zh']
}

/**
 * 取界面文案
 * @param {Lang} lang
 * @param {string} key
 */
export function t(lang, key) {
  for (const l of fallbackChain(lang)) {
    const v = MESSAGES[l]?.[key]
    if (v != null && v !== '') return v
  }
  return String(key)
}

/** 页面长文案覆盖表：以英文原文为 key（ja / ru / ar） */
const COPY = { ja: copyJa, ru: copyRu, ar: copyAr }

/**
 * 页面文案取值。源语言是中文，英文为对照；日本語/Русский/العربية 走 COPY 覆盖表。
 * 未命中的条目回退英文，保证任何情况下都不会出现空白或键名。
 *
 * tx('ja', 'Why us', '我们的优势') -> '私たちが選ばれる理由'
 */
export function tx(lang, en, zh) {
  if (lang === 'zh' || lang === 'zh-hant') return zh ?? en ?? ''
  if (lang === 'en') return en ?? zh ?? ''
  const table = COPY[lang]
  const hit = table?.[en]
  if (hit) return hit
  return en ?? zh ?? ''
}

/** 该语言的整包界面文案（备用） */
export function messagesOf(lang) {
  return MESSAGES[lang] ?? MESSAGES.en
}

/**
 * 从多语言字段对象里取值，带回退。
 * pick('ja', { zh: '滤芯', en: 'Filter', ja: 'フィルター' }) -> 'フィルター'
 */
export function pick(lang, obj) {
  if (obj == null) return ''
  if (typeof obj === 'string') return obj
  for (const l of fallbackChain(lang)) {
    const v = obj[l]
    if (v != null && v !== '') return v
  }
  return obj.zh ?? obj.en ?? ''
}

/**
 * 数据层「xxxZh / xxxEn」扁平字段的兼容取值器。
 * bi(lang, group, 'name') 会依次尝试 name.{lang} → nameJa … → nameEn → nameZh
 *
 * @param {Lang} lang
 * @param {Record<string, any>} obj
 * @param {string} field  不含语言后缀的字段名，如 'name'、'desc'、'points'
 */
export function bi(lang, obj, field) {
  if (!obj) return ''
  const nested = obj[field]
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    const v = pick(lang, nested)
    if (v) return v
  }
  const langKeyMap = {
    zh: `Zh`,
    en: `En`,
    'zh-hant': `Zhhant`,
    ja: `Ja`,
    ru: `Ru`,
    ar: `Ar`,
  }
  // 扁平字段形如 nameZh / nameEn / descZh / pointsEn（字段名保持原样大小写）
  const candidates = [field, field.charAt(0).toUpperCase() + field.slice(1)]
  for (const l of fallbackChain(lang)) {
    for (const key of candidates) {
      const v = obj[`${key}${langKeyMap[l]}`]
      if (v != null && (Array.isArray(v) ? v.length > 0 : v !== '')) return v
    }
  }
  for (const key of candidates) {
    const v = obj[`${key}Zh`] ?? obj[`${key}En`]
    if (v != null) return v
  }
  return ''
}

/* ==========================================================================
   本地化格式（数字 / 日期 / 电话）
   ========================================================================== */

/** 按语言格式化数字（阿拉伯语用西文数字，符合海湾地区商业惯例） */
export function fmtNumber(n, lang) {
  const intl = langMeta[lang]?.intl ?? 'en-US'
  try {
    return new Intl.NumberFormat(intl, { useGrouping: true }).format(n)
  } catch {
    return String(n)
  }
}

/** 紧凑数字：12,345 -> 1.2万 / 1.2万 / 12.3K / 1.2万 / 12,3 тыс. / ١٢ ألف 视语言而定 */
export function fmtCompact(n, lang) {
  const intl = langMeta[lang]?.intl ?? 'en-US'
  try {
    return new Intl.NumberFormat(intl, { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  } catch {
    return String(n)
  }
}

/** 按语言格式化日期 */
export function fmtDate(date, lang, opts = {}) {
  const intl = langMeta[lang]?.intl ?? 'en-US'
  const d = date instanceof Date ? date : new Date(date)
  try {
    return new Intl.DateTimeFormat(intl, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...opts,
    }).format(d)
  } catch {
    return d.toISOString().slice(0, 10)
  }
}

/** 按语言格式化「年-月」 */
export function fmtYearMonth(date, lang) {
  return fmtDate(date, lang, { month: 'long', day: undefined })
}

/** 电话显示：中国大陆号码 +86，香港号码 +852，俄语/阿拉伯语用国际写法 */
export function fmtPhone(raw, lang) {
  const digits = String(raw ?? '').replace(/[^\d+]/g, '')
  return digits
}

/* ==========================================================================
   导航
   ========================================================================== */

/** 组装导航结构（供页头/页脚/移动菜单共用） */
export function buildNav(lang) {
  const p = (path) => localizePath(path, lang)
  return [
    { key: 'products', label: t(lang, 'navProducts'), href: p('/products/') },
    { key: 'solutions', label: t(lang, 'navSolutions'), href: p('/applications/') },
    { key: 'search', label: t(lang, 'navSearch'), href: p('/search/') },
    { key: 'service', label: t(lang, 'navService'), href: p('/service/') },
    { key: 'quality', label: t(lang, 'navQuality'), href: p('/quality/') },
    { key: 'about', label: t(lang, 'navAbout'), href: p('/about/') },
    { key: 'news', label: t(lang, 'navNews'), href: p('/news/') },
    { key: 'contact', label: t(lang, 'navContact'), href: p('/contact/') },
  ]
}
