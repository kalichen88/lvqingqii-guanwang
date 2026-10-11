/**
 * SEO 工具 / SEO helpers
 * ---------------------------------------------------------------------------
 * 统一生成：canonical、hreflang、Open Graph、Twitter Card 与 JSON-LD 结构化数据。
 * 中英双语页面互为 alternate，帮助 Google 正确区分语言版本。
 */

import siteConfig from '../../site.config.mjs'
import { LANGS, langMeta, localizePath, neutralPath } from '../i18n/index.mjs'

const ORIGIN = siteConfig.url.replace(/\/+$/, '')

/** 拼接绝对地址 */
export const abs = (path = '/') => {
  const clean = '/' + String(path).replace(/^\/+/, '')
  return ORIGIN + clean
}

/** 组合页面标题：页面名 | 品牌名 */
export function pageTitle(lang, title) {
  const brand = lang === 'en' ? siteConfig.brand.shortNameEn : siteConfig.brand.shortNameZh
  if (!title) return brand
  // 已经包含品牌名就不再拼接
  if (title.includes(brand) || title.includes(siteConfig.brand.shortNameZh)) return title
  return `${title} | ${brand}`
}

/** 截断描述到合适长度（中英文长度阈值不同） */
export function clampDesc(text, lang = 'zh') {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim()
  const max = lang === 'en' ? 158 : 78
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

/**
 * 生成 hreflang alternate 列表。
 * @param {string} pathname 当前页面的中性路径（如 /products/）
 */
export function alternates(pathname) {
  const neutral = neutralPath(pathname)
  const list = LANGS.map((l) => ({
    hreflang: langMeta[l].code,
    href: abs(localizePath(neutral, l)),
  }))
  // x-default 指向中文版（主要市场）
  list.push({ hreflang: 'x-default', href: abs(localizePath(neutral, 'zh')) })
  return list
}

/* ==========================================================================
   JSON-LD 结构化数据
   ========================================================================== */

/** 组织信息（全站注入一次即可） */
export function organizationJsonLd(lang = 'zh') {
  const contact = siteConfig.contact
  const isEn = lang === 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: isEn ? siteConfig.brand.legalNameEn : siteConfig.brand.legalNameZh,
    alternateName: isEn ? siteConfig.brand.shortNameZh : siteConfig.brand.shortNameEn,
    url: abs(localizePath('/', lang)),
    logo: abs('/brand/logo.svg'),
    description: isEn ? siteConfig.brand.positioningEn : siteConfig.brand.positioningZh,
    foundingDate: String(siteConfig.compliance.since),
    address: {
      '@type': 'PostalAddress',
      streetAddress: isEn ? contact.addressEn : contact.addressZh,
      addressCountry: 'CN',
      addressRegion: isEn ? 'Guangdong' : '广东省',
      addressLocality: isEn ? 'Dongguan' : '东莞市',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.salesPhone,
        contactType: 'sales',
        areaServed: 'Worldwide',
        availableLanguage: ['zh-CN', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: contact.techPhone,
        contactType: 'technical support',
        availableLanguage: ['zh-CN', 'en'],
      },
    ],
    email: contact.email,
    sameAs: siteConfig.principal.officialSite ? [siteConfig.principal.officialSite] : [],
  }
}

/** 站点级搜索入口 */
export function websiteJsonLd(lang = 'zh') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: abs(localizePath('/', lang)),
    name: lang === 'en' ? siteConfig.brand.shortNameEn : siteConfig.brand.shortNameZh,
    inLanguage: langMeta[lang].code,
    publisher: { '@id': `${ORIGIN}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${abs(localizePath('/search/', lang))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** 面包屑 */
export function breadcrumbJsonLd(lang, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: abs(localizePath(item.href, lang)),
    })),
  }
}

/** 产品（用于件号详情页，是 B2B 采购搜索的核心结构化数据） */
export function productJsonLd(lang, product, group) {
  const isEn = lang === 'en'
  const name = isEn
    ? `${product.partNo} ${product.typeEn || product.type} — ${group?.nameEn ?? ''}`
    : `${product.partNo} ${product.type} — ${group?.nameZh ?? ''}`

  const props = []
  if (product.spec) props.push({ '@type': 'PropertyValue', name: isEn ? 'Dimensions' : '规格尺寸', value: product.spec })
  props.push({ '@type': 'PropertyValue', name: isEn ? 'Part No.' : '件号', value: product.partNo })
  if (product.categoryName)
    props.push({ '@type': 'PropertyValue', name: isEn ? 'Category' : '品类', value: product.categoryName })

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: product.partNo,
    mpn: product.partNo,
    category: group ? (isEn ? group.nameEn : group.nameZh) : undefined,
    brand: { '@type': 'Brand', name: 'FILTERSUN' },
    manufacturer: { '@type': 'Organization', name: siteConfig.principal.nameEn },
    description: isEn
      ? `${product.partNo} ${product.typeEn || product.type}${product.spec ? `, dimensions ${product.spec}` : ''}. Genuine FILTERSUN replacement filter supplied by an authorized distributor.`
      : `${product.partNo} ${product.type}${product.spec ? `，规格 ${product.spec}` : ''}。富滤盛原厂正品滤芯，授权代理现货供应。`,
    image: product.image ? abs(product.image) : undefined,
    additionalProperty: props,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CNY',
      price: '0',
      priceValidUntil: undefined,
      url: abs(localizePath(`/p/${product.partNo}/`, lang)),
      seller: { '@id': `${ORIGIN}/#organization` },
      // B2B 目录件号，价格面议，用这个字段表达「询价」
      description: isEn ? 'Price on request — contact us for a quotation.' : '价格面议，请联系我们获取报价。',
    },
  }
}

/** FAQ 富摘要 */
export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

/** 列表页（产品大类 / 应用领域） */
export function collectionJsonLd(lang, { name, description, url, items = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: abs(localizePath(url, lang)),
    inLanguage: langMeta[lang].code,
    isPartOf: { '@id': `${ORIGIN}/#website` },
    mainEntity: items.length
      ? {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.slice(0, 50).map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: abs(localizePath(it.href, lang)),
            name: it.name,
          })),
        }
      : undefined,
  }
}

/** 新闻文章 */
export function articleJsonLd(lang, post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: langMeta[lang].code,
    image: post.cover ? abs(post.cover) : undefined,
    author: { '@type': 'Organization', name: siteConfig.brand.legalNameZh },
    publisher: { '@id': `${ORIGIN}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': abs(localizePath(`/news/${post.slug}/`, lang)),
    },
  }
}
