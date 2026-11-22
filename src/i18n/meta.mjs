/**
 * 各页面 SEO 标题与描述（6 语言）
 * ---------------------------------------------------------------------------
 * - 每个条目：{ zh: { t, d }, en: { t, d }, ... }
 * - t = <title>，d = meta description
 * - 值可以是字符串，也可以是 (ctx) => string，用于插入件号数量等动态数据
 * - 缺失语言自动回退到英语（见 pick()）
 */

import { pick } from './index.mjs'

/** @typedef {{ groups?: number, products?: number, categories?: number }} MetaCtx */

export const pageMeta = {
  home: {
    zh: {
      t: '工程机械滤清器_滤芯件号查询_富滤盛授权代理',
      d: '富滤盛（FILTERSUN）授权代理，供应工程机械、商用车、空压机、工业滤芯 9000+ 件号，支持件号/机型查询、现货直发、出口报关。',
    },
    en: {
      t: 'Authorized FILTERSUN Distributor | Filter Part Finder & In-Stock Supply',
      d: 'Authorized FILTERSUN distributor supplying filters for construction machinery, trucks, air compressors and industry. 9,000+ part numbers catalogued, part finder, engineer-backed selection and export support.',
    },
  },
  products: {
    zh: {
      t: '产品中心_滤清器滤芯全品类目录_件号与规格查询',
      d: (c) =>
        `富滤盛授权代理产品目录，按 ${c.groups ?? 8} 大应用类目整理，已收录 ${(c.products ?? 0).toLocaleString()} 个件号，含规格尺寸与实物图。`,
    },
    en: {
      t: 'Products — Filter Part Numbers, Dimensions & Stock',
      d: (c) =>
        `Authorized FILTERSUN catalogue organised into ${c.groups ?? 8} application groups with ${(c.products ?? 0).toLocaleString()} part numbers, real dimensions and product photos.`,
    },
  },
  finder: {
    zh: {
      t: '件号查询_滤芯件号与规格在线检索',
      d: (c) =>
        `富滤盛件号在线查询工具，已收录 ${(c.products ?? 0).toLocaleString()} 个件号，支持按件号、前缀、规格尺寸与品类关键词实时检索，附实物图与规格参数。`,
    },
    en: {
      t: 'Part Finder — Search FILTERSUN Part Numbers & Dimensions',
      d: (c) =>
        `Search ${(c.products ?? 0).toLocaleString()} catalogued FILTERSUN part numbers by number, prefix, dimensions or category, with photos and specifications.`,
    },
  },
  applications: {
    zh: {
      t: '应用领域_工程机械/商用车/空压机滤芯解决方案',
      d: '按行业查看推荐滤芯配置与常见故障点，覆盖工程机械、商用车队、空压机、泵车、注塑机、线切割、发电机组、洁净室新风、农机、船舶等 18 个领域。',
    },
    en: {
      t: 'Applications — Filters by Industry & Machine Type',
      d: 'Filter sets and selection advice by industry: construction machinery, truck and bus fleets, compressed air, concrete pumps, injection moulding, EDM, gensets, cleanrooms, agriculture and marine.',
    },
  },
  service: {
    zh: {
      t: '服务与支持_选型报价_现货发货_质保与出口',
      d: '从需求确认、选型报价到备货发货与使用跟踪的四步服务流程；3000+ 件号常备现货，工作日 16:00 前确认当日发出，支持出口报关与定制开发。',
    },
    en: {
      t: 'Service & Support — Selection, Stock, Warranty and Export',
      d: 'A four-step service flow from requirement to follow-up: part number matching and quotation, same-day dispatch from 3,000+ stocked numbers, technical support, CPIC-insured warranty and export documentation.',
    },
  },
  quality: {
    zh: {
      t: '品牌与品质_富滤盛工厂实力_认证与专利',
      d: (c) =>
        `${c.principalZh ?? '富滤盛'}通过 IATF 16949、ISO 9001、ISO 14001、ISO 45001 体系认证及 TÜV GMC 认证，拥有 ${c.patents ?? ''}项国家专利、${c.plantArea ?? ''}㎡ 生产面积，产品出口 ${c.countries ?? ''} 国家和地区。`,
    },
    en: {
      t: 'Brand & Quality — Factory Strength, Certifications and Patents',
      d: (c) =>
        `${c.principalEn ?? 'FILTERSUN'} is certified to IATF 16949, ISO 9001, ISO 14001 and ISO 45001 with TÜV-verified GMC status, holds ${c.patents ?? ''}+ patents, operates ${c.plantArea ?? ''} m² of production space and exports to ${c.countries ?? ''}+ countries.`,
    },
  },
  about: {
    zh: {
      t: '关于我们_富滤盛授权代理服务商',
      d: (c) =>
        `我们是${c.principalZh ?? '富滤盛'}的授权代理服务商，专注工程机械、商用车、空压机与工业滤清器的正品供应与选型支持，可提供授权文件与批次溯源。`,
    },
    en: {
      t: 'About Us — Authorized FILTERSUN Distributor',
      d: (c) =>
        `We are an authorized distributor of ${c.principalEn ?? 'FILTERSUN'}, supplying genuine filtration products with part-number matching, standing stock, technical support and export documentation.`,
    },
  },
  contact: {
    zh: {
      t: '联系我们_滤清器询价与技术支持',
      d: (c) =>
        `销售热线 ${c.salesPhone ?? ''}，手机 ${c.mobile ?? ''}，WhatsApp ${c.whatsapp ?? ''}，微信 ${c.wechat ?? ''}，邮箱 ${c.email ?? ''}。提供件号核对、批量报价与出口咨询。`,
    },
    en: {
      t: 'Contact Us — Filter Enquiries & Technical Support',
      d: (c) =>
        `Sales ${c.salesPhone ?? ''}, mobile ${c.mobile ?? ''}, WhatsApp ${c.whatsapp ?? ''}, email ${c.email ?? ''}. Part number matching, volume pricing and export enquiries welcome.`,
    },
  },
  faq: {
    zh: {
      t: '常见问题_滤清器采购_正品授权_起订量_交期_质保',
      d: '关于富滤盛授权代理、正品保障、件号查询、起订量与混批、交期与现货、质保与责任险、出口报关、非标定制的常见问题解答。',
    },
    en: {
      t: 'FAQ — Genuine Parts, MOQ, Lead Time and Warranty',
      d: 'Answers on authorized distribution, genuine-part guarantees, part number matching, minimum order quantity, lead times and stock, warranty and product liability insurance, export documentation and custom builds.',
    },
  },
  news: {
    zh: {
      t: '新闻资讯_滤清器选型指南与运维笔记',
      d: '滤清器选型指南、运维要点与采购防坑经验：空气滤芯更换周期、液压滤芯精度选择、国六重卡柴油滤清器、空压机油气分离器压差、车队库存规划等。',
    },
    en: {
      t: 'News & Guides — Filter Selection and Maintenance Notes',
      d: 'Practical filtration guides: air filter change intervals, hydraulic micron ratings, China VI truck fuel filtration, compressor separator pressure drop and fleet filter stock planning.',
    },
  },
  sitemap: {
    zh: {
      t: '网站地图_全部栏目与件号索引',
      d: '本站全部栏目导航与件号索引，按产品大类列出已收录件号，便于快速定位页面。',
    },
    en: {
      t: 'Sitemap — All Sections and Part Number Index',
      d: 'Every section of this site plus a part number index grouped by application family.',
    },
  },
  notFound: {
    zh: {
      t: '页面不存在',
      d: '你访问的页面不存在或已失效。可以返回首页、使用件号查询，或直接联系我们。',
    },
    en: {
      t: 'Page not found',
      d: 'The page you requested does not exist or has moved. Go back home, use the part finder, or contact us directly.',
    },
  },
}

/**
 * 取页面 SEO 文案
 * @param {string} lang
 * @param {keyof typeof pageMeta} key
 * @param {object} [ctx]
 */
export function pageTitle(lang, key, ctx = {}) {
  const entry = pageMeta[key]
  if (!entry) return ''
  const v = pick(lang, entry).t
  return typeof v === 'function' ? v(ctx) : v
}

export function pageDesc(lang, key, ctx = {}) {
  const entry = pageMeta[key]
  if (!entry) return ''
  const v = pick(lang, entry).d
  return typeof v === 'function' ? v(ctx) : v
}
